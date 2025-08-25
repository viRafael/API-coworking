import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CreateReservationDTO } from './dto/create-reservation';
import { User } from 'src/common/decorators/user.decoretor';
import { Roles } from 'src/common/decorators/role.decoretor';
import type { TAuthenticatedUser } from 'src/auth/strategies/jwt.strategies';

@ApiTags('Reservations')
@ApiBearerAuth()
@Controller('reservations')
export class ReservationsController {
  // Implementação de todas as rotas referentes a Reservas
  constructor(private readonly reservationsService: ReservationsService) {}

  // Rota de criação de uma reserva
  @Roles('USER')
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar uma nova reserva' })
  @ApiResponse({ status: 201, description: 'Reserva criada com sucesso.' })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos ou sala indisponível.',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  create(
    @User() user: TAuthenticatedUser,
    @Body() createReservationsDTO: CreateReservationDTO,
  ) {
    return this.reservationsService.create(user.sub, createReservationsDTO);
  }

  // Rota para listar todas as rotas do usuario authenticado
  @Roles('USER')
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todas as reservas do usuário autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Lista de reservas retornada com sucesso.',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  getAllReservations(@User() user: TAuthenticatedUser) {
    return this.reservationsService.getAllUserReservations(user.sub);
  }

  // Rota para pegar o historico de reserva do user autenticado
  @Roles('USER')
  @Get('history')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter histórico de reservas do usuário' })
  @ApiResponse({
    status: 200,
    description: 'Histórico de reservas retornado com sucesso.',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  getHistory(@User() user: TAuthenticatedUser) {
    return this.reservationsService.getHistory(user.sub);
  }

  // Rota para pegar detalhes de uma reserva especifica
  @Roles('USER')
  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter detalhes de uma reserva específica' })
  @ApiResponse({
    status: 200,
    description: 'Detalhes da reserva retornados com sucesso.',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada.' })
  getByID(
    @User() user: TAuthenticatedUser,
    @Param('id', ParseUUIDPipe) reservationID: string,
  ) {
    return this.reservationsService.getByID(user.sub, reservationID);
  }

  // Rota para cancelar um reserva do usuario autenticado(se faltarem mais de 24horas)
  @Roles('USER')
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancelar uma reserva' })
  @ApiResponse({ status: 200, description: 'Reserva cancelada com sucesso.' })
  @ApiResponse({
    status: 400,
    description:
      'Não é possível cancelar a reserva com menos de 24 horas de antecedência.',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  @ApiResponse({ status: 404, description: 'Reserva não encontrada.' })
  delete(
    @User() user: TAuthenticatedUser,
    @Param('id', ParseUUIDPipe) reservationID: string,
  ) {
    return this.reservationsService.deleteAutheticadeUser(
      user.sub,
      reservationID,
    );
  }
}
