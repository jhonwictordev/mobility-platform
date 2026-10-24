import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { WebSocketModule } from './websocket/websocket.module';
import { AuditModule } from './audit/audit.module';
import { NotificationsModule } from './notifications/notifications.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DriversModule } from './drivers/drivers.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { LocationModule } from './location/location.module';
import { PricingModule } from './pricing/pricing.module';
import { DispatchModule } from './dispatch/dispatch.module';
import { PaymentsModule } from './payments/payments.module';
import { TripsModule } from './trips/trips.module';
import { AdminModule } from './admin/admin.module';
import { SecurityHeadersMiddleware } from './common/middleware/security.middleware';

@Module({
  imports: [
    DatabaseModule,
    WebSocketModule,
    AuditModule,
    NotificationsModule,
    UsersModule,
    AuthModule,
    DriversModule,
    VehiclesModule,
    LocationModule,
    PricingModule,
    DispatchModule,
    PaymentsModule,
    TripsModule,
    AdminModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SecurityHeadersMiddleware).forRoutes('*');
  }
}
