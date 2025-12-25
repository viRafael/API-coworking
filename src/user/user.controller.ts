import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { UpdateUserDTO } from './dto/updateUser.user.dto';
import { Roles } from 'src/common/decorators/role.decoretor';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guards';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@ApiTags('User')
@ApiBearerAuth()
@Roles('USER')
@Controller('/users')
export class UserController {
  //Implementação de todas as rotas referentes ao Usuario
  constructor(private readonly userService: UserService) {}

  // Rota para buscar um user pelo ID
  @UseGuards(AuthTokenGuard)
  @Get('me')
  getUserById(@Param(':id') userId: string) {
    return this.userService.getById(userId);
  }

  // Rota para buscar um user pelo Email
  @UseGuards(AuthTokenGuard)
  @Get('me')
  getUserByEmail(@Param(':email') email: string) {
    return this.userService.getByEmail(email);
  }

  // Rota para atualizar o user
  @UseGuards(AuthTokenGuard)
  @Put('me')
  updateUser(
    @Param(':id') userId: string,
    @Body() updateUserDto: UpdateUserDTO,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.userService.update(userId, updateUserDto, tokenPayload);
  }

  // Rota para deletar um user
  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  deleteUser(
    @Param(':id') userId: string,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.userService.delete(userId, tokenPayload);
  }
}
