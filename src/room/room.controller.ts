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
  UsePipes,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RoomService } from './room.service';
import { CreateRoomDTO } from './dto/create-room.dto';
import { UpdateRoomDTO } from './dto/update-room.dto';
import { UpdateStatusDTO } from './dto/update-status.dto';
import { Roles } from 'src/common/decorators/role.decoretor';
import { Public } from 'src/common/decorators/public.decoretor';

@ApiTags('Room')
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Roles('ADMIN')
  @Post('')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar uma nova sala (Admin)' })
  @ApiResponse({ status: 201, description: 'Sala criada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  create(@Body() createRoomDTO: CreateRoomDTO) {
    return this.roomService.create(createRoomDTO);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Listar todas as salas disponíveis' })
  @ApiResponse({
    status: 200,
    description: 'Lista de salas disponíveis retornada com sucesso.',
  })
  getAllRoomsAvaible() {
    return this.roomService.getAllAvaible();
  }

  @Public()
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter detalhes de uma sala específica' })
  @ApiResponse({
    status: 200,
    description: 'Detalhes da sala retornados com sucesso.',
  })
  @ApiResponse({ status: 404, description: 'Sala não encontrada.' })
  getByID(@Param('id', ParseUUIDPipe) idRoom: string) {
    return this.roomService.getByID(idRoom);
  }

  @Roles('ADMIN')
  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar uma sala (Admin)' })
  @ApiResponse({ status: 200, description: 'Sala atualizada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Sala não encontrada.' })
  @UsePipes(UpdateRoomDTO)
  update(
    @Param('id', ParseUUIDPipe) idRoom: string,
    @Body() updateRoomDTO: UpdateRoomDTO,
  ) {
    return this.roomService.update(idRoom, updateRoomDTO);
  }

  @Roles('ADMIN')
  @Patch(':id/status')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar o status de uma sala (Admin)' })
  @ApiResponse({
    status: 200,
    description: 'Status da sala atualizado com sucesso.',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Sala não encontrada.' })
  @UsePipes(UpdateStatusDTO)
  updateStatus(
    @Param('id', ParseUUIDPipe) idRoom: string,
    @Body() updateStatusDTO: UpdateStatusDTO,
  ) {
    return this.roomService.updateStatus(idRoom, updateStatusDTO);
  }

  @Roles('ADMIN')
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar uma sala (Admin)' })
  @ApiResponse({ status: 200, description: 'Sala deletada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Sala não encontrada.' })
  delete(@Param('id', ParseUUIDPipe) idRoom: string) {
    return this.roomService.delete(idRoom);
  }
}
