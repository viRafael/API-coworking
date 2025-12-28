import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUEST_TOKEN_PAYLOAD_KEY, ROUTE_POLICY_KEY } from '../auth.constants';
import { RoutePolicies } from '../enum/route-policy.enum';
import { Request } from 'express';

export class RoutePolicyGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const routePolicyRequired = this.reflector.get<RoutePolicies | undefined>(
      ROUTE_POLICY_KEY,
      context.getHandler(),
    );

    // Rota é publicas, pode passar
    if (!routePolicyRequired) {
      return true;
    }

    // Precisamos do tokenPayload vindo o AuthTokenGuards
    const request: Request = context.switchToHttp().getRequest();
    const tokenPayload = request[REQUEST_TOKEN_PAYLOAD_KEY];

    if (!tokenPayload) {
      throw new UnauthorizedException('User não logado.');
    }

    const { role } = tokenPayload;

    if (role != routePolicyRequired) {
      throw new UnauthorizedException(
        'User não tem permissão requerida, ',
        routePolicyRequired,
      );
    }

    return true;
  }
}
