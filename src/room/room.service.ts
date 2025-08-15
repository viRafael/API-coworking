import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoomDTO } from './dto/create-room.dto';
import { prisma } from 'src/common/prisma/prisma.service';
import { Room, RoomStatus } from '@prisma/client';
import { UpdateRoomDTO } from './dto/update-room.dto';
import { isUUID } from 'class-validator';
import { UpdateStatusDTO } from './dto/update-status.dto';

@Injectable()
export class RoomService {
  async createRoom(createRoomDTO: CreateRoomDTO): Promise<Room> {
    // Verifica se o usuario é um admin

    // Cria o quarto
    try {
      return await prisma.room.create({
        data: {
          name: createRoomDTO.name,
          description: createRoomDTO.description,
          ...(createRoomDTO.status && { status: createRoomDTO.status }),
        },
      });
    } catch (error) {
      throw new BadRequestException(error, 'Error ao criar o Room');
    }
  }

  // Lista todas as Salas disponiveis
  async getAllRooms() {
    try {
      return await prisma.room.findMany({
        where: {
          status: RoomStatus.AVAILABLE,
        },
        select: {
          id: true,
          name: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(
        error,
        'Error ao listar todas as salas disponiveis',
      );
    }
  }

  // Rota para buscar sala pelo ID
  async getByID(idRoom: string): Promise<Room> {
    // Verifica se a string é ID
    if (!isUUID(idRoom)) {
      throw new BadRequestException('ID de usuário inválido');
    }

    // Busca o room
    try {
      return await prisma.room.findUnique({
        where: {
          id: idRoom,
        },
      });
    } catch (error) {
      throw new BadRequestException(error, 'Error ao buscar uma sala pelo ID');
    }
  }

  // Rota para atualizar uma sala pelo ID
  async update(idRoom: string, updateRoomDTO: UpdateRoomDTO) {
    // Verifica se o usuario é um ADMIN

    // Verifica se essa string é um ID
    if (!isUUID(idRoom)) {
      throw new BadRequestException('ID de usuário inválido');
    }

    // Atualiza a sala
    try {
      return await prisma.room.update({
        where: {
          id: idRoom,
        },
        data: {
          ...updateRoomDTO,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      throw new BadRequestException(
        error,
        'Error ao atualizar uma sala pelo ID',
      );
    }
  }

  // Rota para atualizar o status da Sala
  async updateStatus(idRoom: string, updateStatusDTO: UpdateStatusDTO) {
    // Verifica se o usuario é um ADMIN

    // Verifica se essa string é um ID
    if (!isUUID(idRoom)) {
      throw new BadRequestException('ID de usuário inválido');
    }

    // Atualiza a sala
    try {
      return await prisma.room.update({
        where: {
          id: idRoom,
        },
        data: {
          status: updateStatusDTO.status,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      throw new BadRequestException(
        error,
        'Error ao atualizar uma sala pelo ID',
      );
    }
  }

  // Rota para deleter uma instancia de Sala do bd
  async delete(idRoom: string) {
    // Verifica se o usuario é um ADMIN

    // Verifica se essa string é um ID
    if (!isUUID(idRoom)) {
      throw new BadRequestException('ID de usuário inválido');
    }

    // Atualiza a sala
    try {
      return await prisma.room.delete({
        where: {
          id: idRoom,
        },
      });
    } catch (error) {
      throw new BadRequestException(error, 'Error ao deletar uma sala pelo ID');
    }
  }
}
