import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class RefreshTokenDTO {
  @ApiProperty({
    description: 'Token de atualização para gerar um novo token de acesso',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsNotEmpty({ message: 'Refresh token is required' })
  @MinLength(1, { message: 'Refresh token is required' })
  refreshToken: string;
}
