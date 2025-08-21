import { ApiProperty } from '@nestjs/swagger';
import { RoomStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateStatusDTO {
  @ApiProperty({
    description: 'Alterar a estado atual da sala',
    enum: RoomStatus,
    example: 'AVAIBLE',
  })
  @IsEnum(RoomStatus)
  @IsNotEmpty()
  status: RoomStatus;
}
