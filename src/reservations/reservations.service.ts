import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateReservationDTO } from './dto/create-reservation';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class ReservationsService {
  constructor(private readonly prismaService: PrismaService) {}

  // Rota de criar uma reserva no BD
  async create(userId: string, createReservationsDTO: CreateReservationDTO) {
    return await this.prismaService.reservation.create({
      data: {
        userId: userId,
        ...createReservationsDTO,
      },
    });
  }

  // Função para listar todas as reservar do usuario authenticado
  getAllUserReservations(userID: string) {
    return this.prismaService.reservation.findMany({
      where: {
        userId: userID,
      },
    });
  }

  // Função para listar uma refeição espeficifica
  async getByID(userID: string, reservationID: string) {
    // Verificamos existe essa reserva
    const reservation = await this.prismaService.reservation.findUnique({
      where: {
        id: reservationID,
      },
    });

    if (!reservation) {
      throw new NotFoundException('Reserva não encontrada');
    }
    // Verificamos se a reserva é do user autenticado
    if (reservation.userId != userID) {
      throw new UnauthorizedException('Essa reserva não é desse usuario');
    }

    // Retornamos
    return reservation;
  }

  // Função para deletar uma reserva
  async deleteAutheticadeUser(userID: string, reservationID: string) {
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

    if (reservation?.userId != userID) {
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
  async getHistory(userId: string) {
    return this.prismaService.reservation.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        dateReservation: 'asc',
      },
    });
  }

  // Função para retornar todas as reservas
  getAllReservations() {
    return this.prismaService.reservation.findMany();
  }

  // Função para deletar
  deleteReservationWithoutAuthenticadeUser(reservationID: string) {
    return this.prismaService.reservation.delete({
      where: {
        id: reservationID,
      },
    });
  }
}
