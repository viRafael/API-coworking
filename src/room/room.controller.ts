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

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @SetRoutePolicy(RoutePolicies.ADMIN)
  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @Post('')
  create(@Body() createRoomDTO: CreateRoomDTO) {
    return this.roomService.create(createRoomDTO);
  }

  @Get()
  getAllRoomsAvaible() {
    return this.roomService.getAllAvaible();
  }

  @Get(':id')
  getByID(@Param('id', ParseUUIDPipe) idRoom: string) {
    return this.roomService.getByID(idRoom);
  }

  @SetRoutePolicy(RoutePolicies.ADMIN)
  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @Put(':id')
  update(
    @Param('id', ParseUUIDPipe) idRoom: string,
    @Body() updateRoomDTO: UpdateRoomDTO,
  ) {
    return this.roomService.update(idRoom, updateRoomDTO);
  }

  @SetRoutePolicy(RoutePolicies.ADMIN)
  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseUUIDPipe) idRoom: string,
    @Body() updateStatusDTO: UpdateStatusDTO,
  ) {
    return this.roomService.updateStatus(idRoom, updateStatusDTO);
  }

  @SetRoutePolicy(RoutePolicies.ADMIN)
  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @Delete(':id')
  delete(@Param('id', ParseUUIDPipe) idRoom: string) {
    return this.roomService.delete(idRoom);
  }
}
