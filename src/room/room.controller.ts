import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDTO } from './dto/create-room.dto';
import { UpdateRoomDTO } from './dto/update-room.dto';
import { UpdateStatusDTO } from './dto/update-status.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guards';
import { SetRoutePolicy } from 'src/auth/decorator/set-route-policy.decoretor';
import { RoutePolicies } from 'src/auth/enum/route-policy.enum';
import { RoutePolicyGuard } from 'src/auth/guards/route-policy.guards';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Room')
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @ApiOperation({ summary: 'Cria uma nova sala (Somente Admin)' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Sala criada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 409, description: 'Sala com este nome já existe' })
  @SetRoutePolicy(RoutePolicies.ADMIN)
  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @Post('')
  create(@Body() createRoomDTO: CreateRoomDTO) {
    return this.roomService.create(createRoomDTO);
  }

  @ApiOperation({ summary: 'Lista todas as salas disponíveis' })
  @ApiResponse({
    status: 200,
    description: 'Lista de salas disponíveis retornada com sucesso',
  })
  @Get()
  getAllRoomsAvaible() {
    return this.roomService.getAllAvaible();
  }

  @ApiOperation({ summary: 'Busca uma sala pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da sala' })
  @ApiResponse({ status: 200, description: 'Sala encontrada' })
  @ApiResponse({ status: 404, description: 'Sala não encontrada' })
  @Get(':id')
  getByID(@Param('id', ParseUUIDPipe) idRoom: string) {
    return this.roomService.getByID(idRoom);
  }

  @ApiOperation({ summary: 'Atualiza uma sala (Somente Admin)' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID da sala a ser atualizada' })
  @ApiResponse({ status: 200, description: 'Sala atualizada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Sala não encontrada' })
  @SetRoutePolicy(RoutePolicies.ADMIN)
  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) idRoom: string,
    @Body() updateRoomDTO: UpdateRoomDTO,
  ) {
    return this.roomService.update(idRoom, updateRoomDTO);
  }

  @ApiOperation({ summary: 'Atualiza o status de uma sala (Somente Admin)' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID da sala' })
  @ApiResponse({ status: 200, description: 'Status da sala atualizado' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Sala não encontrada' })
  @SetRoutePolicy(RoutePolicies.ADMIN)
  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) idRoom: string,
    @Body() updateStatusDTO: UpdateStatusDTO,
  ) {
    return this.roomService.updateStatus(idRoom, updateStatusDTO);
  }

  @ApiOperation({ summary: 'Deleta uma sala (Somente Admin)' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID da sala a ser deletada' })
  @ApiResponse({ status: 200, description: 'Sala deletada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 404, description: 'Sala não encontrada' })
  @SetRoutePolicy(RoutePolicies.ADMIN)
  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) idRoom: string) {
    return this.roomService.delete(idRoom);
  }
}
