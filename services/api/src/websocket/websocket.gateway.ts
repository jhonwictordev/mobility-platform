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

  constructor(private readonly jwtService: JwtService) {}

  handleConnection(client: Socket) {
    try {
      const rawToken =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization ||
        client.handshake.query?.token;

      if (rawToken) {
        const token = String(rawToken).replace(/^Bearer\s+/i, '');
        const payload = this.jwtService.verify(token);
        client.data.user = payload;
        this.logger.log(`Authenticated client connected: ${client.id} (User: ${payload.sub}, Role: ${payload.role})`);
        return;
      }
    } catch (err: any) {
      this.logger.debug(`Anonymous client connected: ${client.id} (${err.message})`);
    }
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join:passenger')
  handleJoinPassenger(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string },
  ) {
    if (data?.userId) {
      client.join(`passenger:${data.userId}`);
      this.logger.log(`Socket ${client.id} joined passenger:${data.userId}`);
      return { event: 'joined', room: `passenger:${data.userId}` };
    }
  }

  @SubscribeMessage('join:driver')
  handleJoinDriver(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { driverId: string },
  ) {
    if (data?.driverId) {
      client.join(`driver:${data.driverId}`);
      this.logger.log(`Socket ${client.id} joined driver:${data.driverId}`);
      return { event: 'joined', room: `driver:${data.driverId}` };
    }
  }

  @SubscribeMessage('join:trip')
  handleJoinTrip(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { tripId: string },
  ) {
    if (data?.tripId) {
      client.join(`trip:${data.tripId}`);
      this.logger.log(`Socket ${client.id} joined trip:${data.tripId}`);
      return { event: 'joined', room: `trip:${data.tripId}` };
    }
  }

  @SubscribeMessage('join:admin')
  handleJoinAdmin(@ConnectedSocket() client: Socket) {
    // Hardening: Em produção, exigir autenticação estrita de admin
    if (process.env.NODE_ENV === 'production' && client.data?.user?.role !== 'admin') {
      this.logger.warn(`Unauthorized attempt to join admin room from ${client.id}`);
      return { event: 'error', message: 'Acesso negado: Requer privilégios de administrador.' };
    }

    client.join('admin');
    this.logger.log(`Socket ${client.id} joined admin room`);
    return { event: 'joined', room: 'admin' };
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
