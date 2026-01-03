import { ApiProperty } from '@nestjs/swagger';

export class TokenPayloadDto {
  @ApiProperty({
    description: 'The subject of the token, is the user ID.',
    example: 'clxko26520000a4oopvnp6b3a',
  })
  sub: string;

  @ApiProperty({
    description: 'The email of the user.',
    example: 'user@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The timestamp when the token was issued.',
    example: 1672784400,
  })
  iat: number;

  @ApiProperty({
    description: 'The timestamp when the token expires.',
    example: 1672788000,
  })
  exp: number;

  @ApiProperty({
    description: 'The audience of the token.',
    example: 'users',
  })
  aud: string;

  @ApiProperty({
    description: 'The issuer of the token.',
    example: 'your-app-name',
  })
  iss: string;
}
