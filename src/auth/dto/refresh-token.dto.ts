import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'The refresh token used to obtain a new access token.',
    example: 'your_refresh_token_here',
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
