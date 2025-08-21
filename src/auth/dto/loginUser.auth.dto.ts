import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDTO {
  @ApiProperty({
    description: 'Será usado para procurar o Usuario no banco de dados',
    example: 'principes-dos-sayadins@sayadins.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Será usado para comparar com a senha no banco de dados',
    example: 'principedossayadins',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
