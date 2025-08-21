import {
  Body,
  Controller,
  Headers,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/loginUser.auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/role.decoretor';
import { Public } from 'src/common/decorators/public.decoretor';
import { RefreshTokenDTO } from './dto/refreshToken.dto';
import { User } from 'src/common/decorators/user.decoretor';
import type { TAuthenticatedUser } from './strategies/jwt.strategies';
import { CreateUserDTO } from 'src/user/dto/createUser.dto';
import { RequestResetPasswordDTO } from './dto/requestResetPassword.dto';
import { ResetPasswordDTO } from './dto/resetPassword.dto';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/register')
  @ApiOperation({ summary: 'Registrar um novo usuário' })
  @ApiResponse({ status: 201, description: 'Usuário registrado com sucesso.' })
  @ApiResponse({ status: 400, description: 'Dados inválidos.' })
  register(@Body() createUserDTO: CreateUserDTO) {
    return this.authService.register(createUserDTO);
  }

  @Public()
  @Post('/login')
  @ApiOperation({ summary: 'Realizar login' })
  @ApiResponse({
    status: 200,
    description: 'Login bem-sucedido, retorna token de acesso e de refresh.',
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas.' })
  @UsePipes(RefreshTokenDTO)
  login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }

  @Roles('USER')
  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Realizar logout' })
  @ApiResponse({ status: 200, description: 'Logout bem-sucedido.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @UsePipes(RefreshTokenDTO)
  logout(
    @User() user: TAuthenticatedUser,
    @Headers('authorization') authHeader: string,
  ) {
    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException('Usuario não autenticado');
    }

    return this.authService.logout(user.sub, token);
  }

  @Public()
  @Post('/forgot-password')
  @ApiOperation({ summary: 'Solicitar redefinição de senha' })
  @ApiResponse({
    status: 200,
    description: 'Email para redefinição de senha enviado com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  requestResetPassword(
    @Body() requestResetPasswordDTO: RequestResetPasswordDTO,
  ) {
    return this.authService.sendForgetPasswordEmail(requestResetPasswordDTO);
  }

  @Public()
  @Post('/reset-password')
  @ApiOperation({ summary: 'Redefinir a senha' })
  @ApiResponse({ status: 200, description: 'Senha redefinida com sucesso.' })
  @ApiResponse({ status: 400, description: 'Token inválido ou expirado.' })
  resetPassword(
    @Query('token') token: string,
    @Body() resetPasswordDTO: ResetPasswordDTO,
  ) {
    return this.authService.resetPassword(token, resetPasswordDTO);
  }
}
