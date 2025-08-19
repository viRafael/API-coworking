import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateReservationDTO {
  @IsUUID()
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDate()
  @IsNotEmpty()
  dateReservation: Date;

  @IsDate()
  @IsNotEmpty()
  startTime: Date;

  @IsDate()
  @IsNotEmpty()
  endTime: Date;
}
