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
import { ReservationsService } from './reservations.service';
import { CreateReservationDTO } from './dto/create-reservation';
import { TokenPayloadParam } from 'src/auth/params/token-payload.param';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guards';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @ApiOperation({ summary: 'Cria uma nova reserva' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Reserva criada com sucesso' })
  @ApiResponse({ status: 401, description: 'Usuário não autenticado' })
  @ApiResponse({
    status: 409,
    description: 'Conflito de horário para a sala',
  })
  @UseGuards(AuthTokenGuard)
  @Post()
  create(
    @Body() createReservationsDTO: CreateReservationDTO,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.reservationsService.create(createReservationsDTO, tokenPayload);
  }

  @ApiOperation({ summary: 'Lista todas as reservas do usuário autenticado' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Reservas listadas com sucesso' })
  @ApiResponse({ status: 401, description: 'Usuário não autenticado' })
  @UseGuards(AuthTokenGuard)
  @Get()
  getAllReservations(@TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.reservationsService.getAllUserReservations(tokenPayload);
  }

  @ApiOperation({ summary: 'Retorna o histórico de reservas do usuário' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Histórico retornado com sucesso' })
  @ApiResponse({ status: 401, description: 'Usuário não autenticado' })
  @UseGuards(AuthTokenGuard)
  @Get('history')
  getHistory(@TokenPayloadParam() tokenPayload: TokenPayloadDto) {
    return this.reservationsService.getHistory(tokenPayload);
  }

  @ApiOperation({ summary: 'Busca uma reserva pelo ID' })
  @ApiParam({ name: 'id', description: 'ID da reserva' })
  @ApiResponse({ status: 200, description: 'Reserva encontrada' })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada' })
  @Get(':id')
  getByID(@Param('id', ParseUUIDPipe) reservationID: string) {
    return this.reservationsService.getByID(reservationID);
  }

  @ApiOperation({ summary: 'Cancela uma reserva' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID da reserva a ser cancelada' })
  @ApiResponse({ status: 200, description: 'Reserva cancelada com sucesso' })
  @ApiResponse({ status: 401, description: 'Usuário não autenticado' })
  @ApiResponse({
    status: 403,
    description: 'Cancelamento não permitido (menos de 24h restantes)',
  })
  @UseGuards(AuthTokenGuard)
  @Delete(':id')
  delete(
    @Param('id', ParseUUIDPipe) reservationID: string,
    @TokenPayloadParam() tokenPayload: TokenPayloadDto,
  ) {
    return this.reservationsService.deleteAutheticadeUser(
      tokenPayload,
      reservationID,
    );
  }
}
