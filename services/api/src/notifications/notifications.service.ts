import { Injectable, Logger } from '@nestjs/common';
import { MobilityWebSocketGateway } from '../websocket/websocket.gateway';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private readonly wsGateway: MobilityWebSocketGateway) {}

  async sendPushNotification(
    recipientId: string,
    role: 'passenger' | 'driver',
    title: string,
    body: string,
    data?: any,
  ) {
    this.logger.log(`[PUSH] To ${role}:${recipientId} | ${title} - ${body}`);
    const payload = { title, body, data, timestamp: new Date().toISOString() };
    if (role === 'passenger') {
      this.wsGateway.emitToPassenger(recipientId, 'notification:received', payload);
    } else {
      this.wsGateway.emitToDriver(recipientId, 'notification:received', payload);
    }
    return { delivered: true, recipientId, timestamp: new Date() };
  }
}
