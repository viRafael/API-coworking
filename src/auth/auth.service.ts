import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import { HashingService } from './hashing/hashing.service';
import jwtConfig from './config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { env } from 'process';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { RequestResetPasswordDto } from './dto/request-reset-password.dto';
import { MailService } from 'src/common/mail/mail.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashsingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
  ) {}

  private async generateToken<T>(sub: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub,
        ...payload,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: expiresIn,
      },
    );
  }

  async register(registerDto: RegisterDto) {
    // Verifico se já existe um User com esse email
    const existUser = await this.prismaService.user.findUnique({
      where: {
        email: registerDto.email,
      },
    });

    if (existUser) {
      throw new ForbiddenException('Email already in use');
    }

    // Cria a instancia
    return this.userService.createUser(registerDto);
  }

  async login(loginDto: LoginDto) {
    let passwordIsValid = false;

    // Verifico se há um usuario com esse email
    const user = await this.userService.getByEmail(loginDto.email);

    // Verifico se a senha bate
    if (user) {
      passwordIsValid = await this.hashsingService.compare(
        loginDto.password,
        user.password,
      );
    }

    if (!passwordIsValid || !user) {
      throw new UnauthorizedException('Email or password invalid');
    }

    const accesToken = await this.generateToken<Partial<User>>(
      user.id,
      this.jwtConfiguration.jwtTtl,
      { email: user.email },
    );

    const refreshToken = await this.generateToken<Partial<User>>(
      user.id,
      this.jwtConfiguration.jwtRefreshTtl,
    );

    return {
      accesToken,
      refreshToken,
    };
  }

  async logout(tokenPayload: TokenPayloadDto, token: string) {
    return await this.prismaService.blackListTokens.create({
      data: {
        userId: tokenPayload.sub,
        token: token,
      },
    });
  }

  async sendForgetPasswordEmail(
    requestResetPasswordDTO: RequestResetPasswordDto,
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

    await this.mailService.sendPasswordResetEmail(
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
      const tokenPayload = this.jwtService.verify<{ sub: string }>(token, {
        secret: env.JWT_SECRET,
        issuer: 'reset-password',
        ignoreExpiration: false,
      });

      const hashedPassword = await this.hashsingService.hash(
        resetPasswordDTO.password,
      );

      await this.userService.updatePassword(tokenPayload.sub, hashedPassword);
    } catch {
      throw new ForbiddenException('Invalid or expired reset password token');
    }
  }

  async refreshTokens(refreshTokens: RefreshTokenDto) {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayloadDto>(
        refreshTokens.refreshToken,
        this.jwtConfiguration,
      );

      const user = await this.prismaService.user.findUnique({
        where: {
          id: payload.sub,
        },
      });

      if (!user) {
        throw new Error('Pessoa não encontrada');
      }

      const accesToken = await this.generateToken<Partial<User>>(
        user.id,
        this.jwtConfiguration.jwtTtl,
        { email: user.email },
      );

      const refreshToken = await this.generateToken<Partial<User>>(
        user.id,
        this.jwtConfiguration.jwtRefreshTtl,
      );

      return {
        accesToken,
        refreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
