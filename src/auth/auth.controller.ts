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
import { RefreshTokenDto } from './dto/refresh-token.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Realiza o login do usuário' })
  @ApiResponse({ status: 200, description: 'Login bem-sucedido' })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas' })
  @Post()
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiOperation({ summary: 'Realiza o logout do usuário' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Logout bem-sucedido' })
  @ApiResponse({ status: 401, description: 'Usuário não autenticado' })
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

  @ApiOperation({ summary: 'Registra um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso' })
  @ApiResponse({ status: 409, description: 'Email já está em uso' })
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Solicita a redefinição de senha' })
  @ApiResponse({
    status: 200,
    description: 'Email de redefinição de senha enviado',
  })
  @Post('/forgot-password')
  requestResetPassword(
    @Body() requestResetPasswordDTO: RequestResetPasswordDto,
  ) {
    return this.authService.sendForgetPasswordEmail(requestResetPasswordDTO);
  }

  @ApiOperation({ summary: 'Reseta a senha do usuário' })
  @ApiQuery({ name: 'token', description: 'Token de redefinição de senha' })
  @ApiResponse({ status: 200, description: 'Senha alterada com sucesso' })
  @Post('/reset-password')
  resetPassword(
    @Query('token') token: string,
    @Body() resetPasswordDTO: ResetPasswordDTO,
  ) {
    return this.authService.resetPassword(token, resetPasswordDTO);
  }

  @ApiOperation({ summary: 'Atualiza os tokens de acesso' })
  @ApiResponse({ status: 200, description: 'Tokens atualizados com sucesso' })
  @ApiResponse({ status: 401, description: 'Refresh token inválido' })
  @Post('refresh')
  refreshTokens(@Body() refreshTokens: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokens);
  }
}
