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

    const acessToken = await this.generateAcessToken(user.id, user.email);

    return {
      acessToken,
    };
  }

  async generateAcessToken(userId: string, email: string) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        email: email,
      },
      {
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.jwtTtl,
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
      const tokenPayload = await this.jwtService.verify<
        Promise<{ sub: string }>
      >(token, {
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
}
