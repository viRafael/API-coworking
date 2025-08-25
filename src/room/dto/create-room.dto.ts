import { ApiProperty } from '@nestjs/swagger';
import { RoomStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoomDTO {
  @ApiProperty({
    description: 'Nome aqual será dado a sala',
    example: 'Sala Dupla 03',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Informações extras da sala ',
    example: 'Quarto com banheiro extendido',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description:
      'Status atual do quarto, se está disponivel, indisponivel ou em manutenção',
    enum: RoomStatus,
  })
  @IsEnum(RoomStatus)
  status?: RoomStatus;
}
