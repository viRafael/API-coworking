import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { AdminService } from './admin.service';
import { ReservationsService } from 'src/reservations/reservations.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AdminController],
  providers: [AdminService, PrismaService, ReservationsService],
})
export class AdminModule {}
