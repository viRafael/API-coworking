import { Controller, Delete, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { Roles } from 'src/common/decorators/role.decoretor';
import { ReservationsService } from 'src/reservations/reservations.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly reservationService: ReservationsService) {}

  // Rota para listar todas as reservas do ADMIN
  @Roles('ADMIN')
  @Get('reservation')
  getAllReservation() {
    return this.reservationService.getAllReservations();
  }

  // Rota para remover um reserva
  @Roles('ADMIN')
  @Delete(':id')
  deleteReservation(@Param(':id', ParseUUIDPipe) reservationID: string) {
    return this.reservationService.deleteReservationWithoutAuthenticadeUser(
      reservationID,
    );
  }
}
