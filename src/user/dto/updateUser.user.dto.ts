import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDTO {
  @ApiProperty({
    description: 'Nome no novo usuario',
    example: 'Roberto Maxilius Segundo',
  })
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    description: 'Email so usuario, será usado como identificador unico',
    example: 'RobertoMaxilius2@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Senha de identificação do usuario',
    example: 'tambemsofrobullyporcausadomeunome',
  })
  @IsString()
  @IsNotEmpty()
  password?: string;
}
