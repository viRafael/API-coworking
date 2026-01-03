import { ApiProperty } from '@nestjs/swagger';
import { RoomStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateRoomDTO {
  @ApiProperty({
    description: 'The name of the room.',
    example: 'Conference Room B',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    description: 'A description of the room.',
    example: 'A small meeting room.',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiProperty({
    description: 'The status of the room.',
    enum: RoomStatus,
    example: RoomStatus.MAINTENANCE,
    required: false,
  })
  @IsEnum(RoomStatus)
  @IsNotEmpty()
  status?: RoomStatus;
}
