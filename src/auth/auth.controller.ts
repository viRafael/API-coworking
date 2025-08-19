import {
  Body,
  Controller,
  Headers,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from './dto/createUser.auth.dto';
import { LoginDTO } from './dto/loginUser.auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/role.decoretor';
import { Public } from 'src/common/decorators/public.decoretor';
import { RefreshTokenDTO } from './dto/refreshToken.dto';
import { User } from 'src/common/decorators/user.decoretor';
import type { TAuthenticatedUser } from './strategies/jwt.strategies';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Rota para cadastro de usuario
  @Public()
  @Post('/register')
  register(@Body() createUserDTO: CreateUserDTO) {
    return this.authService.register(createUserDTO);
  }

  // Rota para login e geração do token JWT
  @Public()
  @Post('/login')
  @UsePipes(RefreshTokenDTO)
  login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO);
  }

  // Rota para logout do usuário
  @Roles('USER')
  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  @UsePipes(RefreshTokenDTO)
  logout(@User() user: TAuthenticatedUser) {
    return this.authService.logout(user.sub);
  }

  // // Rota para solicitação de redefinição de senha
  // @Post('/forgot-password')
  // requestResetPassword() {}

  // // Rota para redifinir senha
  // @Post('/reset-password')
  // resetPassword() {}
}
