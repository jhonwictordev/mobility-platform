import { Module, Global } from '@nestjs/common';
import { MobilityWebSocketGateway } from './websocket.gateway';

@Global()
@Module({
  providers: [MobilityWebSocketGateway],
  exports: [MobilityWebSocketGateway],
})
export class WebSocketModule {}
