import { RoomStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateRoomDTO {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsEnum(RoomStatus)
  @IsNotEmpty()
  status?: RoomStatus;
}
