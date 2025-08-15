import { RoomStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateStatusDTO {
  @IsEnum(RoomStatus)
  @IsNotEmpty()
  status: RoomStatus;
}
