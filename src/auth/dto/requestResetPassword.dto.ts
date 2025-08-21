import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestResetPasswordDTO {
  @ApiProperty({
    description: 'Será usado para procurar o Usuario no banco de dados',
    example: 'principedossayadins@sayadin.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
