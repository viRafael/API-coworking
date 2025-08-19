import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UpdateUserDTO } from './dto/updateUser.user.dto';
import { CreateUserDTO } from './dto/createUser.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  //Implementação de toda a logicas das rotas referentes ao Usuario
  constructor(private readonly prismaService: PrismaService) {}

  // Função de criação de um novo usuario
  async createUser(createUserDTO: CreateUserDTO) {
    // Verificar se o email já está em uso
    const userAlreadyExist = await this.prismaService.user.findUnique({
      where: {
        email: createUserDTO.email,
      },
      select: {
        id: true,
      },
    });

    if (userAlreadyExist) {
      throw new BadRequestException('User already exist.');
    }

    // Hash na senha dele
    const hashedPassword = await bcrypt.hash(createUserDTO.password, 10);

    // Cria a instancia do usuario e retorna
    return this.prismaService.user.create({
      data: {
        name: createUserDTO.name,
        email: createUserDTO.email,
        password: hashedPassword,
      },
      omit: {
        password: true,
      },
    });
  }

  // Retorna os dados do usuário autenticado.
  async getById(userId: string) {
    return this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      omit: {
        password: true,
      },
    });
  }

  // Atualiza os dados do usuário autenticado
  async update(id: string, updatedUser: UpdateUserDTO) {
    // Verifica se há um usuario com esse ID
    const oldUser = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!oldUser) {
      throw new NotFoundException('Não existe usuário com esse ID');
    }

    // Atualiza o usuario
    return await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...updatedUser,
        updateAt: new Date(),
      },
    });
  }
}
