import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { TAccessTokenPayload } from 'src/common/types/tokens';
import { env } from 'src/utils/env-validator';

export type TAuthenticatedUser = {
  sub: string;
  role: UserRole;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly prismaService: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    payload: TAccessTokenPayload,
  ): Promise<TAuthenticatedUser> {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req as any);

    if (!token) {
      throw new UnauthorizedException('Token não encontrado');
    }

    const isTokenBlacklisted =
      await this.prismaService.blackListTokens.findFirst({
        where: { token },
      });

    if (isTokenBlacklisted) {
      throw new UnauthorizedException('Token is blacklisted');
    }

    return {
      sub: payload.sub,
      role: payload.role,
    };
  }
}
