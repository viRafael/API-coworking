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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly reservationService: ReservationsService,
    private readonly adminService: AdminService,
  ) {}

  @ApiOperation({ summary: 'Retorna dos as reservas' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Retorna a lista de reservas',
  })
  // Rota para listar todas as reservas
  @SetRoutePolicy(RoutePolicies.ADMIN)
  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @Get('reservation')
  getAllReservation() {
    return this.reservationService.getAllReservations();
  }

  // Rota para remover um reserva
  @ApiOperation({ summary: 'Remove uma reserva' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Deleta a reserva com o ID compativel',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({
    status: 404,
    description: 'Reserva com o ID compativel não foi achada',
  })
  @ApiParam({
    name: 'id',
    description: 'ID da reserva que deseja ser deletada',
  })
  @SetRoutePolicy(RoutePolicies.ADMIN)
  @UseGuards(AuthTokenGuard, RoutePolicyGuard)
  @Delete(':id')
  deleteReservation(@Param('id', ParseUUIDPipe) reservationID: string) {
    return this.reservationService.deleteReservationWithoutAuthenticadeUser(
      reservationID,
    );
  }

  // Rota para colocar um token na black list
  @ApiOperation({ summary: 'Coloca um token na black list' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Coloca o token na black list',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiParam({ name: 'userID', description: 'Id do usuario' })
  @ApiParam({ name: 'token', description: 'Token do usuario' })
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
