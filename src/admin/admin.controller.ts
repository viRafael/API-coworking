import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators/role.decoretor';
import { ReservationsService } from 'src/reservations/reservations.service';
import { AdminService } from './admin.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly reservationService: ReservationsService,
    private readonly adminService: AdminService,
  ) {}

  // Rota para listar todas as reservas do ADMIN
  @Roles('ADMIN')
  @Get('reservation')
  @ApiOperation({ summary: 'Lista todas as reservas' })
  @ApiResponse({ status: 200, description: 'Retorno com sucesso' })
  @ApiResponse({
    status: 409,
    description: 'Error ao criar inserir na blaclist',
  })
  getAllReservation() {
    return this.reservationService.getAllReservations();
  }

  // Rota para remover um reserva
  @Roles('ADMIN')
  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma reserva' })
  @ApiResponse({ status: 200, description: 'Removida com sucesso' })
  @ApiResponse({ status: 409, description: 'Error ao remover um reserva' })
  deleteReservation(@Param(':id', ParseUUIDPipe) reservationID: string) {
    return this.reservationService.deleteReservationWithoutAuthenticadeUser(
      reservationID,
    );
  }

  // Rota para colocar um token na black list
  @Roles('ADMIN')
  @Put(':userID/:token')
  @ApiOperation({ summary: 'Coloca um token recebido na black list' })
  @ApiResponse({ status: 200, description: 'Adicionado com sucesso' })
  @ApiResponse({
    status: 409,
    description: 'Error ao colocar o token na blaclist',
  })
  putTokenOnBlacklist(
    @Param(':id', ParseUUIDPipe) userID: string,
    @Param(':token') token: string,
  ) {
    return this.adminService.putTokenOnBlaclist(userID, token);
  }
}
