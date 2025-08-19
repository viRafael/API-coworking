import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDTO } from './dto/create-reservation';
import { User } from 'src/common/decorators/user.decoretor';
import { Roles } from 'src/common/decorators/role.decoretor';
import type { TAuthenticatedUser } from 'src/auth/strategies/jwt.strategies';

@Controller('reservations')
export class ReservationsController {
  // Implementação de todas as rotas referentes a Reservas
  constructor(private readonly reservationsService: ReservationsService) {}

  // Rota de criação de uma reserva
  @Roles('USER')
  @Post()
  create(
    @User() user: TAuthenticatedUser,
    @Body() createReservationsDTO: CreateReservationDTO,
  ) {
    return this.reservationsService.create(user.sub, createReservationsDTO);
  }

  // Rota para listar todas as rotas do usuario authenticado
  @Roles('USER')
  @Get()
  getAllReservations(@User() user: TAuthenticatedUser) {
    return this.reservationsService.getAllReservations(user.sub);
  }

  // Rota para pegar detalhes de uma reserva especifica
  @Roles('USER')
  @Get(':id')
  getByID(
    @User() user: TAuthenticatedUser,
    @Param('id', ParseUUIDPipe) reservationID: string,
  ) {
    return this.reservationsService.getByID(user.sub, reservationID);
  }

  // Rota para cancelar um reserva do usuario autenticado(se faltarem mais de 24horas)
  @Roles('USER')
  @Delete(':id')
  delete(
    @User() user: TAuthenticatedUser,
    @Param(':id', ParseUUIDPipe) reservationID: string,
  ) {
    return this.reservationsService.delete(user.sub, reservationID);
  }

  // Rota para pegar o historico de reserva do user autenticado
  @Roles('USER')
  @Get('history')
  getHistory(@User() user: TAuthenticatedUser) {
    return this.reservationsService.getHistory(user.sub);
  }
}
