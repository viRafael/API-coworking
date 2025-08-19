import { Body, Controller, Get, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { UpdateUserDTO } from './dto/updateUser.user.dto';
import { Roles } from 'src/common/decorators/role.decoretor';
import type { TAuthenticatedUser } from 'src/auth/strategies/jwt.strategies';
import { User as UserDecorator } from 'src/common/decorators/user.decoretor';

@Roles('USER')
@Controller('/users')
export class UserController {
  //Implementação de todas as rotas referentes ao Usuario
  constructor(private readonly userService: UserService) {}

  // Retorna os dados do usuário autenticado.
  @Get('me')
  getUser(@UserDecorator() user: TAuthenticatedUser) {
    return this.userService.getById(user.sub);
  }

  // Atualiza os dados do usuário autenticado
  @Put('me')
  updateUser(
    @UserDecorator() user: TAuthenticatedUser,
    @Body() updatedUserDTO: UpdateUserDTO,
  ): Promise<User> {
    return this.userService.update(user.sub, updatedUserDTO);
  }
}
