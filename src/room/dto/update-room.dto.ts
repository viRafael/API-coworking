import { ApiProperty } from '@nestjs/swagger';
import { RoomStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateRoomDTO {
  @ApiProperty({
    description: 'Pode ser alterado o nome da sala',
    example: 'Quarto 12-3',
  })
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    description: 'Pode ser alterado a descrição da sala',
    example: 'Piso refeito',
  })
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiProperty({
    description: 'Alterar a estado atual da sala',
    enum: RoomStatus,
    example: 'MAINTENANCE',
  })
  @IsEnum(RoomStatus)
  @IsNotEmpty()
  status?: RoomStatus;
}
