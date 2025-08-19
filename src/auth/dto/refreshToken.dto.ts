import { IsNotEmpty, MinLength } from 'class-validator';

export class RefreshTokenDTO {
  @IsNotEmpty({ message: 'Refresh token is required' })
  @MinLength(1, { message: 'Refresh token is required' })
  refreshToken: string;
}
