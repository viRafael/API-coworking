import { Body, Controller, Get, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { UpdateUserDTO } from './dto/updateUser.user.dto';

@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  //Implementação de todas as rotas referentes ao Usuario

  // Retorna os dados do usuário autenticado.
  @Get('me')
  getUser(@Body() id: string) {
    return this.userService.getUser(id);
  }

  // Atualiza os dados do usuário autenticado
  @Put('me')
  updateUser(
    @Body() id: string,
    @Body() updatedUser: UpdateUserDTO,
  ): Promise<User> {
    return this.updateUser(id, updatedUser);
  }
}
