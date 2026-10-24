import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MobilityWebSocketGateway } from './websocket.gateway';

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'replace_with_secure_random_jwt_secret_minimum_32_characters',
    }),
  ],
  providers: [MobilityWebSocketGateway],
  exports: [MobilityWebSocketGateway],
})
export class WebSocketModule {}
