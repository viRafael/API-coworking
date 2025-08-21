import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDTO } from './dto/loginUser.auth.dto';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { CreateUserDTO } from 'src/user/dto/createUser.dto';
import { UserRole } from '@prisma/client';
import { MailService } from 'src/common/mail/mail.service';
import { RequestResetPasswordDTO } from './dto/requestResetPassword.dto';
import { ResetPasswordDTO } from './dto/resetPassword.dto';
import { env } from 'src/utils/env-validator';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
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
  async logout(userID: string, token: string) {
    return await this.prismaService.blackListTokens.create({
      data: {
        userId: userID,
        token: token,
      },
    });
  }

  async sendForgetPasswordEmail(
    requestResetPasswordDTO: RequestResetPasswordDTO,
  ) {
    // Verificamos se existe um user com esse email
    const user = await this.prismaService.user.findUnique({
      where: {
        email: requestResetPasswordDTO.email,
      },
    });

    if (!user) {
      throw new NotFoundException('Email não encontrado');
    }

    // Enviamos o email
    const token = this.jwtService.sign(
      { sub: requestResetPasswordDTO.email, iss: 'reset-password' },
      { expiresIn: '5m' },
    );

    this.mailService.sendPasswordResetEmail(
      requestResetPasswordDTO.email,
      token,
    );

    return {
      message: 'Password reset email send successfully',
    };
  }

  // Função para redefinir a senha do usuario
  async resetPassword(token: string, resetPasswordDTO: ResetPasswordDTO) {
    try {
      const tokenPayload = await this.jwtService.verify<
        Promise<{ sub: string }>
      >(token, {
        secret: env.JWT_SECRET,
        issuer: 'reset-password',
        ignoreExpiration: false,
      });

      const hashedPassword = await bcrypt.hash(resetPasswordDTO.password, 10);

      await this.userService.updatePassword(tokenPayload.sub, hashedPassword);
    } catch {
      throw new ForbiddenException('Invalid or expired reset password token');
    }
  }
}
