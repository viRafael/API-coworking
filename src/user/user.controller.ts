import { Body, Controller, Get, Put } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { UpdateUserDTO } from './dto/updateUser.user.dto';
import { Roles } from 'src/common/decorators/role.decoretor';

@ApiTags('User')
@ApiBearerAuth()
@Roles('USER')
@Controller('/users')
export class UserController {
  //Implementação de todas as rotas referentes ao Usuario
  constructor(private readonly userService: UserService) {}

  // // Retorna os dados do usuário autenticado.
  // @Get('me')
  // @ApiOperation({ summary: 'Obter dados do usuário autenticado' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Dados do usuário retornados com sucesso.',
  // })
  // @ApiResponse({ status: 401, description: 'Não autorizado.' })
  // getUser(@UserDecorator() user: TAuthenticatedUser) {
  //   return this.userService.getById(user.sub);
  // }

  // // Atualiza os dados do usuário autenticado
  // @Put('me')
  // @ApiOperation({ summary: 'Atualizar dados do usuário autenticado' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Dados do usuário atualizados com sucesso.',
  // })
  // @ApiResponse({ status: 401, description: 'Não autorizado.' })
  // updateUser(
  //   @UserDecorator() user: TAuthenticatedUser,
  //   @Body() updatedUserDTO: UpdateUserDTO,
  // ): Promise<User> {
  //   return this.userService.update(user.sub, updatedUserDTO);
  // }
}
