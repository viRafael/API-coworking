import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDTO {
  @ApiProperty({
    description: 'Será a nova senha a qual vamos inserir no banco de dados',
    example: 'kakaroto, seu verme',
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
