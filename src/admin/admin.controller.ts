import {
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ReservationsService } from 'src/reservations/reservations.service';
import { AdminService } from './admin.service';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guards';
import { SetRoutePolicy } from 'src/auth/decorator/set-route-policy.decoretor';
import { RoutePolicies } from 'src/auth/enum/route-policy.enum';
import { RoutePolicyGuard } from 'src/auth/guards/route-policy.guards';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly reservationService: ReservationsService,
    private readonly adminService: AdminService,
  ) {}

  // Rota para listar todas as reservas
  @SetRoutePolicy(RoutePolicies.ADMIN)
  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @Get('reservation')
  getAllReservation() {
    return this.reservationService.getAllReservations();
  }

  // Rota para remover um reserva
  @SetRoutePolicy(RoutePolicies.ADMIN)
  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @Delete(':id')
  deleteReservation(@Param('id', ParseUUIDPipe) reservationID: string) {
    return this.reservationService.deleteReservationWithoutAuthenticadeUser(
      reservationID,
    );
  }

  // Rota para colocar um token na black list
  @SetRoutePolicy(RoutePolicies.ADMIN)
  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @Put(':userID/:token')
  putTokenOnBlacklist(
    @Param('userID', ParseUUIDPipe) userID: string,
    @Param('token') token: string,
  ) {
    return this.adminService.putTokenOnBlaclist(userID, token);
  }
}
