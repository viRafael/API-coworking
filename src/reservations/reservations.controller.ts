import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CreateReservationDTO } from './dto/create-reservation';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guards';

@ApiTags('Reservations')
@ApiBearerAuth()
@Controller('reservations')
export class ReservationsController {
  // Implementação de todas as rotas referentes a Reservas
  constructor(private readonly reservationsService: ReservationsService) {}

  // Rota de criação de uma reserva
  @Post()
  create(
    @Body() createReservationsDTO: CreateReservationDTO,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.reservationsService.create(createReservationsDTO, tokenPayload);
  }

  // // Rota para listar todas as rotas do usuario authenticado
  @UseGuards(AuthTokenGuard)
  @Get()
  getAllReservations(tokenPayload: TokenPayloadDto) {
    return this.reservationsService.getAllUserReservations(tokenPayload);
  }

  // Rota para pegar o historico de reserva do user autenticado
  @UseGuards(AuthTokenGuard)
  @Get('history')
  getHistory(@TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.reservationsService.getHistory(tokenPayload);
  }

  // Rota para pegar detalhes de uma reserva especifica
  @Get(':id')
  getByID(@Param('id', ParseUUIDPipe) reservationID: string) {
    return this.reservationsService.getByID(reservationID);
  }

  // Rota para cancelar um reserva do usuario autenticado(se faltarem mais de 24horas)
  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  delete(
    @Param('id', ParseUUIDPipe) reservationID: string,
    tokenPayload: TokenPayloadDto,
  ) {
    return this.reservationsService.deleteAutheticadeUser(
      tokenPayload,
      reservationID,
    );
  }
}
