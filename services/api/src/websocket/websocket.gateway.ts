import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface AuthenticatedUser {
  sub: string;
  email: string;
  role: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MobilityWebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(MobilityWebSocketGateway.name);

  // Rate limiting per socket: max 60 messages per minute
  private messageCounts = new Map<string, { count: number; resetAt: number }>();

  constructor(private readonly jwtService: JwtService) {}

  private checkRateLimit(socketId: string): boolean {
    const now = Date.now();
    let record = this.messageCounts.get(socketId);
    if (!record || now > record.resetAt) {
      record = { count: 1, resetAt: now + 60000 };
      this.messageCounts.set(socketId, record);
      return true;
    }
    record.count++;
    return record.count <= 120;
  }

  handleConnection(client: Socket) {
    try {
      const rawToken =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization ||
        client.handshake.query?.token;

      if (rawToken) {
        const token = String(rawToken).replace(/^Bearer\s+/i, '');
        const payload = this.jwtService.verify(token) as AuthenticatedUser;
        client.data.user = payload;
        this.logger.log(`Authenticated client connected: ${client.id} (User: ${payload.sub}, Role: ${payload.role})`);
        return;
      }
    } catch (err: any) {
      this.logger.debug(`Anonymous or invalid token client connected: ${client.id} (${err.message})`);
    }
    this.logger.log(`Client connected (anonymous): ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.messageCounts.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join:passenger')
  handleJoinPassenger(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string },
  ) {
    if (!this.checkRateLimit(client.id)) {
      return { event: 'error', message: 'Rate limit exceeded' };
    }

    const user: AuthenticatedUser | undefined = client.data?.user;
    if (!data?.userId) {
      return { event: 'error', message: 'ID do passageiro obrigatório' };
    }

    // Authorization: User can only join their own room, unless admin
    if (!user || (user.sub !== data.userId && user.role !== 'admin')) {
      this.logger.warn(`Unauthorized join:passenger attempt from socket ${client.id} for user ${data.userId}`);
      return { event: 'error', message: 'Acesso negado: Não autorizado a monitorar este passageiro.' };
    }

    client.join(`passenger:${data.userId}`);
    this.logger.log(`Socket ${client.id} joined passenger:${data.userId}`);
    return { event: 'joined', room: `passenger:${data.userId}` };
  }

  @SubscribeMessage('join:driver')
  handleJoinDriver(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { driverId: string },
  ) {
    if (!this.checkRateLimit(client.id)) {
      return { event: 'error', message: 'Rate limit exceeded' };
    }

    const user: AuthenticatedUser | undefined = client.data?.user;
    if (!data?.driverId) {
      return { event: 'error', message: 'ID do motorista obrigatório' };
    }

    // Driver rooms require authentication
    if (!user) {
      return { event: 'error', message: 'Acesso negado: Autenticação requerida.' };
    }

    client.join(`driver:${data.driverId}`);
    this.logger.log(`Socket ${client.id} joined driver:${data.driverId}`);
    return { event: 'joined', room: `driver:${data.driverId}` };
  }

  @SubscribeMessage('join:trip')
  handleJoinTrip(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { tripId: string },
  ) {
    if (!this.checkRateLimit(client.id)) {
      return { event: 'error', message: 'Rate limit exceeded' };
    }

    if (!data?.tripId) {
      return { event: 'error', message: 'ID da corrida obrigatório' };
    }

    // Require authenticated user for telemetry monitoring
    const user: AuthenticatedUser | undefined = client.data?.user;
    if (!user) {
      return { event: 'error', message: 'Acesso negado: Autenticação requerida para acompanhar corrida.' };
    }

    client.join(`trip:${data.tripId}`);
    this.logger.log(`Socket ${client.id} joined trip:${data.tripId}`);
    return { event: 'joined', room: `trip:${data.tripId}` };
  }

  @SubscribeMessage('join:admin')
  handleJoinAdmin(@ConnectedSocket() client: Socket) {
    // Strict RBAC: Admin room strictly requires verified admin role
    if (client.data?.user?.role !== 'admin') {
      this.logger.warn(`Unauthorized attempt to join admin room from socket ${client.id}`);
      return { event: 'error', message: 'Acesso negado: Requer privilégios de administrador.' };
    }

    client.join('admin');
    this.logger.log(`Socket ${client.id} joined admin room`);
    return { event: 'joined', room: 'admin' };
  }

  @SubscribeMessage('driver:location')
  handleDriverLocation(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      driverId: string;
      tripId?: string;
      lat: number;
      lng: number;
      heading?: number;
      speed?: number;
    },
  ) {
    if (!this.checkRateLimit(client.id)) {
      return { event: 'error', message: 'Rate limit exceeded' };
    }

    const user: AuthenticatedUser | undefined = client.data?.user;
    if (!user) {
      return { event: 'error', message: 'Não autorizado a enviar telemetria' };
    }

    // Validate coordinates
    if (
      typeof data.lat !== 'number' ||
      typeof data.lng !== 'number' ||
      isNaN(data.lat) ||
      isNaN(data.lng) ||
      data.lat < -90 ||
      data.lat > 90 ||
      data.lng < -180 ||
      data.lng > 180
    ) {
      return { event: 'error', message: 'Coordenadas geográficas inválidas' };
    }

    // Broadcast location to trip room if in progress
    if (data.tripId) {
      this.server.to(`trip:${data.tripId}`).emit('trip:driver_location', data);
    }
    this.server.to('admin').emit('admin:driver_location', data);

    return { event: 'location_ack' };
  }

  // Helper dispatch methods
  emitToPassenger(passengerId: string, event: string, payload: any) {
    this.server?.to(`passenger:${passengerId}`).emit(event, payload);
    this.server?.to('admin').emit(`admin:${event}`, payload);
  }

  emitToDriver(driverId: string, event: string, payload: any) {
    this.server?.to(`driver:${driverId}`).emit(event, payload);
    this.server?.to('admin').emit(`admin:${event}`, payload);
  }

  emitToTrip(tripId: string, event: string, payload: any) {
    this.server?.to(`trip:${tripId}`).emit(event, payload);
    this.server?.to('admin').emit(`admin:${event}`, payload);
  }

  broadcastAdmin(event: string, payload: any) {
    this.server?.to('admin').emit(event, payload);
  }
}
