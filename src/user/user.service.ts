import { BadRequestException, Injectable } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { prisma } from 'src/common/prisma/prisma.service';
import { UpdateUserDTO } from './dto/updateUser.user.dto';

@Injectable()
export class UserService {
  //Implementação de toda a logicas das rotas referentes ao Usuario

  // Retorna os dados do usuário autenticado.
  async getUser(userId: string) {
    // Verifica se a string passada é um ID
    if (!isUUID(userId)) {
      throw new BadRequestException('ID de usuário inválido');
    }

    // Verifica se o existe esse usuario
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      omit: {
        password: true,
      },
    });

    if (!user) {
      throw new BadRequestException('Não existe usuario com esse ID');
    }

    return user;
  }

  // Atualiza os dados do usuário autenticado
  async updateUser(id: string, updatedUser: UpdateUserDTO) {
    // Verifica se a string passada é um ID
    if (isUUID(id)) {
      throw new BadRequestException('ID de usuário inválido');
    }

    // Verifica se há um usuario com esse ID
    const oldUser = await prisma.user.findFirst({
      where: {
        id,
      },
    });

    if (!oldUser) {
      throw new BadRequestException('Não existe usuário com esse ID');
    }

    // Atualiza o usuario
    try {
      return await prisma.user.update({
        where: {
          id,
        },
        data: {
          ...updatedUser,
          updateAt: new Date(),
        },
      });
    } catch (error) {
      throw new BadRequestException(error, 'Error ao atualizar o usuário');
    }
  }
}
