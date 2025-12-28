import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateReservationDTO } from './dto/create-reservation';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@Injectable()
export class ReservationsService {
  constructor(private readonly prismaService: PrismaService) {}

  // Rota de criar uma reserva no BD
  async create(
    createReservationsDTO: CreateReservationDTO,
    tokenPayload: TokenPayloadDto,
  ) {
    return await this.prismaService.reservation.create({
      data: {
        userId: tokenPayload.sub,
        ...createReservationsDTO,
      },
    });
  }

  // Função para listar todas as reservar do usuario authenticado
  getAllUserReservations(tokenPayload: TokenPayloadDto) {
    return this.prismaService.reservation.findMany({
      where: {
        userId: tokenPayload.sub,
      },
    });
  }

  // Função para listar uma reserva espeficifica
  getByID(reservationID: string) {
    return this.prismaService.reservation.findUnique({
      where: {
        id: reservationID,
      },
    });
  }

  // Função para deletar uma reserva
  async deleteAutheticadeUser(
    tokenPayload: TokenPayloadDto,
    reservationID: string,
  ) {
    // Verificar se o user da reserva bate com o autenticado
    const reservation = await this.prismaService.reservation.findFirst({
      where: {
        id: reservationID,
      },
    });

    // Verificar se existe a reserva
    if (!reservation) {
      throw new NotFoundException('Reserva não encontrada');
    }

    if (reservation?.userId != tokenPayload.sub) {
      throw new UnauthorizedException('Reserva não pertence ao usuario');
    }

    // Deletar
    return this.prismaService.reservation.delete({
      where: {
        id: reservationID,
      },
    });
  }

  // Função para gerar um historico das reservas do usuario autenticado
  async getHistory(tokenPayload: TokenPayloadDto) {
    return this.prismaService.reservation.findMany({
      where: {
        userId: tokenPayload.sub,
      },
      orderBy: {
        dateReservation: 'asc',
      },
    });
  }

  // Função para retornar todas as reservas
  async getAllReservations() {
    return this.prismaService.reservation.findMany();
  }

  // Função para deletar
  async deleteReservationWithoutAuthenticadeUser(reservationID: string) {
    return this.prismaService.reservation.delete({
      where: {
        id: reservationID,
      },
    });
  }
}
