import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './dto/loginUser.auth.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDTO } from 'src/user/dto/createUser.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  // Registro de usuario
  async register(createUserDTO: CreateUserDTO) {
    return this.userService.createUser(createUserDTO);
  }

  // Rota de login e geração do token JWT
  async login(loginDTO: LoginDTO) {
    // Verifica se o email existe no BD
    const user = await this.prismaService.user.findUnique({
      where: {
        email: loginDTO.email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email ou Senha inválidas');
    }

    // Verifica se a senha passada e igual ao do BD
    const isPasswordValid = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Email ou Senha inválidas');
    }

    // Criamos os tokens
    const { accessToken, refreshToken } = await this.generateTokens(
      user.id,
      user.role,
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  // Função para Geração de Tokens
  async generateTokens(userId: string, role: UserRole = UserRole.USER) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          role: role,
        },
        {
          expiresIn: '15min',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          role: role,
        },
        {
          expiresIn: '15min',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  // Rota para logout
  async logout() {

  }

  // Rota para solicitação de redefinição de senha

  // Rota para redifinir senha
}
