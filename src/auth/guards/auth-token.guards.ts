import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import jwtConfig from '../config/jwt.config';
import type { ConfigType } from '@nestjs/config';
import { REQUEST_TOKEN_PAYLOAD_KEY, ROLE_KEY } from '../auth.constants';
import { TokenPayloadDto } from '../dto/token-payload.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('User not logged in');
    }

    try {
      const payload = await this.jwtService.verifyAsync<TokenPayloadDto>(
        token,
        this.jwtConfiguration,
      );

      // Verificando se o User é ADMIN
      const isAdmin = await this.prismaService.user.findUnique({
        where: {
          id: payload.sub,
          role: 'ADMIN',
        },
      });

      if (!isAdmin) {
        payload[ROLE_KEY] = 'USER';
      } else {
        payload[ROLE_KEY] = 'ADMIN';
      }

      request[REQUEST_TOKEN_PAYLOAD_KEY] = payload;
    } catch (error) {
      throw new UnauthorizedException(error);
    }

    return true;
  }

  extractTokenFromHeader(request: Request): string | undefined {
    const authorization = request.headers?.authorization;

    if (!authorization || typeof authorization !== 'string') {
      return undefined;
    }

    return authorization.split(' ')[1];
  }
}
