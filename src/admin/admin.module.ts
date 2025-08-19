import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { ReservationsModule } from 'src/reservations/reservations.module';

@Module({
  imports: [ReservationsModule],
  controllers: [AdminController],
  providers: [PrismaService],
})
export class AdminModule {}
