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
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guards';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly reservationService: ReservationsService,
    private readonly adminService: AdminService,
  ) {}

  // Rota para listar todas as reservas
  @UseGuards(AuthTokenGuard)
  @Get('reservation')
  getAllReservation(@TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.reservationService.getAllReservations(tokenPayload);
  }

  // Rota para remover um reserva
  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  deleteReservation(
    @Param('id', ParseUUIDPipe) reservationID: string,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.reservationService.deleteReservationWithoutAuthenticadeUser(
      reservationID,
      tokenPayload,
    );
  }

  // Rota para colocar um token na black list
  @UseGuards(AuthTokenGuard)
  @Put(':userID/:token')
  putTokenOnBlacklist(
    @Param('userID', ParseUUIDPipe) userID: string,
    @Param('token') token: string,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.adminService.putTokenOnBlaclist(userID, token, tokenPayload);
  }
}
