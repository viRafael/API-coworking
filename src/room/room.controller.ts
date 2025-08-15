import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDTO } from './dto/create-room.dto';
import { UpdateRoomDTO } from './dto/update-room.dto';
import { UpdateStatusDTO } from './dto/update-status.dto';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  // Rota para criar uma Sala
  @Post('')
  create(createRoomDTO: CreateRoomDTO) {
    return this.roomService.createRoom(createRoomDTO);
  }

  // Rota para listar todas as Salas disponiveis
  @Get('')
  getAllRooms() {
    return this.roomService.getAllRooms();
  }

  // Rota para listar um Sala especifica
  @Get(':id')
  getByID(@Param('id') idRoom: string) {
    return this.roomService.getByID(idRoom);
  }

  // Rota para atualizar uma Sala especifica
  @Put(':id')
  update(@Param('id') idRoom: string, @Body() updateRoomDTO: UpdateRoomDTO) {
    return this.roomService.update(idRoom, updateRoomDTO);
  }

  // Rota para atualizar o status de uma Sala
  @Patch(':id/status')
  updateStatus(
    @Param('id') idRoom: string,
    @Body() updateStatusDTO: UpdateStatusDTO,
  ) {
    return this.roomService.updateStatus(idRoom, updateStatusDTO);
  }

  // Rota para deletar uma Sala do BD
  @Delete(':id')
  delete(@Param('id') idRoom: string) {
    return this.roomService.delete(idRoom);
  }
}
