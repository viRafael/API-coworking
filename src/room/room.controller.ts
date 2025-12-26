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
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guards';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @UseGuards(AuthTokenGuard)
  @Post('')
  create(
    @Body() createRoomDTO: CreateRoomDTO,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.roomService.create(createRoomDTO, tokenPayload);
  }

  @Get()
  getAllRoomsAvaible() {
    return this.roomService.getAllAvaible();
  }

  @Get(':id')
  getByID(@Param('id', ParseUUIDPipe) idRoom: string) {
    return this.roomService.getByID(idRoom);
  }

  @UseGuards(AuthTokenGuard)
  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) idRoom: string,
    @Body() updateRoomDTO: UpdateRoomDTO,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.roomService.update(idRoom, updateRoomDTO, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) idRoom: string,
    @Body() updateStatusDTO: UpdateStatusDTO,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.roomService.updateStatus(idRoom, updateStatusDTO, tokenPayload);
  }

  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  delete(
    @Param('id', ParseUUIDPipe) idRoom: string,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.roomService.delete(idRoom, tokenPayload);
  }
}
