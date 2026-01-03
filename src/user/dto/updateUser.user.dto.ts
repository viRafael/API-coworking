import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDTO {
  @ApiProperty({
    description: 'The name of the user.',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiProperty({
    description: 'The email of the user.',
    example: 'user@example.com',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'The password of the user.',
    example: 'password123',
    required: false,
  })
  @IsString()
  @IsNotEmpty()
  password?: string;
}
