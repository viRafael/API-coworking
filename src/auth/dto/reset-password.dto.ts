
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDTO {
  @ApiProperty({
    description: 'The new password for the user.',
    example: 'newPassword123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
