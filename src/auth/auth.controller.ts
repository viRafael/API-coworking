import {
  Body,
  Controller,
  Headers,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { TokenPayloadParam } from './params/token-payload.param';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('/logout')
  logout(
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
    @Headers('authorization') authHeader: string,
  ) {
    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('Usuario não autenticado');
    }

    return this.authService.logout(tokenPayload, token);
  }

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('/forgot-password')
  requestResetPassword(
    @Body() requestResetPasswordDTO: RequestResetPasswordDto,
  ) {
    return this.authService.sendForgetPasswordEmail(requestResetPasswordDTO);
  }

  @Post('/reset-password')
  resetPassword(
    @Query('token') token: string,
    @Body() resetPasswordDTO: ResetPasswordDTO,
  ) {
    return this.authService.resetPassword(token, resetPasswordDTO);
  }
}
