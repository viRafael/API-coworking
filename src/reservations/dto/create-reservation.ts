import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateReservationDTO {
  @ApiProperty({
    description: 'The ID of the room to be reserved.',
    example: 'clxko26520000a4oopvnp6b3a',
  })
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @ApiProperty({
    description: 'The name of the reservation.',
    example: 'Team Meeting',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'A description of the reservation.',
    example: 'Weekly team sync.',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The date of the reservation.',
    example: '2026-01-03T00:00:00.000Z',
  })
  @IsNotEmpty()
  @Type(() => Date)
  dateReservation: Date;

  @ApiProperty({
    description: 'The start time of the reservation.',
    example: '2026-01-03T10:00:00.000Z',
  })
  @IsNotEmpty()
  @Type(() => Date)
  startTime: Date;

  @ApiProperty({
    description: 'The end time of the reservation.',
    example: '2026-01-03T11:00:00.000Z',
  })
  @IsNotEmpty()
  @Type(() => Date)
  endTime: Date;
}
