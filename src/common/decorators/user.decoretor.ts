// import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { Request } from 'express';
// import { TAuthenticatedUser } from 'src/auth/strategies/jwt.strategies';

// export const User = createParamDecorator(
//   (data: keyof TAuthenticatedUser | undefined, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest<Request>();
//     const user = request.user as TAuthenticatedUser | undefined;

//     if (data) {
//       return user?.[data];
//     } else {
//       return user;
//     }
//   },
// );
