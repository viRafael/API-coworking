import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from '../user/user.module';
import { RoomModule } from '../room/room.module';
import { ReservationsModule } from '../reservations/reservations.module';
import { AdminModule } from '../admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { MailModule } from 'src/common/mail/mail.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // time to live em ms
        limit: 60, // máximo de requests durante o ttl
        blockDuration: 5000, // tempo de bloqueio
      },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    RoomModule,
    ReservationsModule,
    AdminModule,
    AuthModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
