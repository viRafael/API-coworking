import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({
    description: 'Nome no novo usuario',
    example: 'Roberto Maxilius',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Email so usuario, será usado como identificador unico',
    example: 'RobertoMaxilius@gmail.com',
  })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Senha de identificação do usuario',
    example: 'sofrobullyporcausadomeunome',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
