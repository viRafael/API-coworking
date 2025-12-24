import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import { HashingService } from './hashing/hashing.service';
import jwtConfig from './config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashsingService: HashingService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
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
}
