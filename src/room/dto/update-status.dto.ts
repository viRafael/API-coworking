import { ApiProperty } from '@nestjs/swagger';
import { RoomStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateStatusDTO {
  @ApiProperty({
    description: 'The new status of the room.',
    enum: RoomStatus,
    example: RoomStatus.OCCUPIED,
  })
  @IsEnum(RoomStatus)
  @IsNotEmpty()
  status: RoomStatus;
}
