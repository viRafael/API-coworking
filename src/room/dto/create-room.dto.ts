import { ApiProperty } from '@nestjs/swagger';
import { RoomStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoomDTO {
  @ApiProperty({
    description: 'The name of the room.',
    example: 'Conference Room A',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'A description of the room.',
    example: 'A large conference room with a projector.',
    required: false,
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The status of the room.',
    enum: RoomStatus,
    example: RoomStatus.AVAILABLE,
    required: false,
  })
  @IsEnum(RoomStatus)
  status?: RoomStatus;
}
