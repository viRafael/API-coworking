import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateReservationDTO {
  @ApiProperty({
    description:
      'ID da sala a qual a reserva se refere, o exemplo dependerá do banco de dados usado',
  })
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @ApiProperty({
    description: 'Nome de identificação da reserva',
    example: 'Reserva da sala 03',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Refere-se informações extras sobre a reserva',
    example: 'Reserva para a viagem de final de ano',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Data na qual a reserva foi criada',
    example: '04/12/2025',
  })
  @IsNotEmpty()
  @Type(() => Date)
  dateReservation: Date;

  @ApiProperty({
    description: 'Data na qual a reserva da sala começa',
    example: '12/12/2025',
  })
  @IsNotEmpty()
  @Type(() => Date)
  startTime: Date;

  @ApiProperty({
    description: 'Data na qual a reserva da sala termina',
    example: '24/12/2025',
  })
  @IsNotEmpty()
  @Type(() => Date)
  endTime: Date;
}
