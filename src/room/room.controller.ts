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
import { RoomService } from './room.service';
import { CreateRoomDTO } from './dto/create-room.dto';
import { UpdateRoomDTO } from './dto/update-room.dto';
import { UpdateStatusDTO } from './dto/update-status.dto';
import { Roles } from 'src/common/decorators/role.decoretor';
import { Public } from 'src/common/decorators/public.decoretor';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  // Rota para criar uma Sala
  @Roles('ADMIN')
  @Post('')
  create(createRoomDTO: CreateRoomDTO) {
    return this.roomService.create(createRoomDTO);
  }

  // Rota para listar todas as Salas disponiveis
  @Public()
  @Get()
  getAllRoomsAvaible() {
    return this.roomService.getAllAvaible();
  }

  // Rota para listar um Sala especifica
  @Public()
  @Get(':id')
  getByID(@Param('id', ParseUUIDPipe) idRoom: string) {
    return this.roomService.getByID(idRoom);
  }

  // Rota para atualizar uma Sala especifica
  @Roles('ADMIN')
  @Put(':id')
  @UsePipes(UpdateRoomDTO)
  update(
    @Param('id', ParseUUIDPipe) idRoom: string,
    @Body() updateRoomDTO: UpdateRoomDTO,
  ) {
    return this.roomService.update(idRoom, updateRoomDTO);
  }

  // Rota para atualizar o status de uma Sala
  @Roles('ADMIN')
  @Patch(':id/status')
  @UsePipes(UpdateStatusDTO)
  updateStatus(
    @Param('id', ParseUUIDPipe) idRoom: string,
    @Body() updateStatusDTO: UpdateStatusDTO,
  ) {
    return this.roomService.updateStatus(idRoom, updateStatusDTO);
  }

  // Rota para deletar uma Sala do BD
  @Roles('ADMIN')
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) idRoom: string) {
    return this.roomService.delete(idRoom);
  }
}
