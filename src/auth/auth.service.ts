import {
  ForbiddenException,
  Inject,
  Injectable,
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

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashsingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
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
}
