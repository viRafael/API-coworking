import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateRoomDTO } from './dto/create-room.dto';
import { Room, RoomStatus } from '@prisma/client';
import { UpdateRoomDTO } from './dto/update-room.dto';
import { UpdateStatusDTO } from './dto/update-status.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@Injectable()
export class RoomService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createRoomDTO: CreateRoomDTO,
    tokenPayload: TokenPayloadDto,
  ): Promise<Room> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: tokenPayload.sub,
      },
    });

    if (!user) {
      throw new NotFoundException('User authenticado não encontrado');
    }

    if (user.role !== 'ADMIN') {
      throw new UnauthorizedException('User authenticado não é ADMIN');
    }

    return await this.prismaService.room.create({
      data: {
        name: createRoomDTO.name,
        description: createRoomDTO.description,
        ...(createRoomDTO.status && { status: createRoomDTO.status }),
      },
    });
  }

  // Lista todas as Salas disponiveis
  async getAllAvaible() {
    return await this.prismaService.room.findMany({
      where: {
        status: RoomStatus.AVAILABLE,
      },
      select: {
        id: true,
        name: true,
      },
    });
  }

  // Rota para buscar sala pelo ID
  async getByID(idRoom: string) {
    return this.prismaService.room.findUnique({
      where: {
        id: idRoom,
      },
    });
  }

  // Rota para atualizar uma sala pelo ID
  async update(
    idRoom: string,
    updateRoomDTO: UpdateRoomDTO,
    tokenPayload: TokenPayloadDto,
  ) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: tokenPayload.sub,
      },
    });

    if (!user) {
      throw new NotFoundException('User authenticado não encontrado');
    }

    if (user.role !== 'ADMIN') {
      throw new UnauthorizedException('User authenticado não é ADMIN');
    }

    return await this.prismaService.room.update({
      where: {
        id: idRoom,
      },
      data: {
        ...updateRoomDTO,
        updatedAt: new Date(),
      },
    });
  }

  // Rota para atualizar o status da Sala
  async updateStatus(
    idRoom: string,
    updateStatusDTO: UpdateStatusDTO,
    tokenPayload: TokenPayloadDto,
  ) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: tokenPayload.sub,
      },
    });

    if (!user) {
      throw new NotFoundException('User authenticado não encontrado');
    }

    if (user.role !== 'ADMIN') {
      throw new UnauthorizedException('User authenticado não é ADMIN');
    }

    return await this.prismaService.room.update({
      where: {
        id: idRoom,
      },
      data: {
        status: updateStatusDTO.status,
        updatedAt: new Date(),
      },
    });
  }

  // Rota para deleter uma instancia de Sala do bd
  async delete(idRoom: string, tokenPayload: TokenPayloadDto) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: tokenPayload.sub,
      },
    });

    if (!user) {
      throw new NotFoundException('User authenticado não encontrado');
    }

    if (user.role !== 'ADMIN') {
      throw new UnauthorizedException('User authenticado não é ADMIN');
    }

    return await this.prismaService.room.delete({
      where: {
        id: idRoom,
      },
    });
  }
}
