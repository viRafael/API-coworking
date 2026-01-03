import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDTO } from './dto/updateUser.user.dto';
import { Roles } from 'src/common/decorators/role.decoretor';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guards';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@Roles('USER')
@Controller('/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Busca um usuário pelo ID' })
  @ApiParam({ name: ':id', description: 'ID do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @UseGuards(AuthTokenGuard)
  @Get('byId')
  getUserById(@Param(':id') userId: string) {
    return this.userService.getById(userId);
  }

  @ApiOperation({ summary: 'Busca um usuário pelo Email' })
  @ApiParam({ name: ':email', description: 'Email do usuário' })
  @ApiResponse({ status: 200, description: 'Usuário encontrado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @UseGuards(AuthTokenGuard)
  @Get('byEmail')
  getUserByEmail(@Param(':email') email: string) {
    return this.userService.getByEmail(email);
  }

  @ApiOperation({ summary: 'Atualiza o usuário' })
  @ApiBearerAuth()
  @ApiParam({
    name: ':id',
    description:
      'ID do usuário a ser atualizado (não utilizado na implementação atual)',
  })
  @ApiResponse({ status: 200, description: 'Usuário atualizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @UseGuards(AuthTokenGuard)
  @Put()
  updateUser(
    @Param(':id') userId: string,
    @Body() updateUserDto: UpdateUserDTO,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.userService.update(userId, updateUserDto, tokenPayload);
  }

  @ApiOperation({ summary: 'Deleta um usuário' })
  @ApiBearerAuth()
  @ApiParam({ name: ':id', description: 'ID do usuário a ser deletado' })
  @ApiResponse({ status: 200, description: 'Usuário deletado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado' })
  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  deleteUser(
    @Param(':id') userId: string,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.userService.delete(userId, tokenPayload);
  }
}
