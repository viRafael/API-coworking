import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UpdateUserDTO } from './dto/updateUser.user.dto';
import { CreateUserDTO } from './dto/createUser.dto';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';

@Injectable()
export class UserService {
  //Implementação de toda a logicas das rotas referentes ao Usuario
  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashingService: HashingService,
  ) {}

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
    const hashedPassword = await this.hashingService.hash(
      createUserDTO.password,
    );

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
  getById(userId: string) {
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
  async update(
    id: string,
    updatedUser: UpdateUserDTO,
    tokenPayload: TokenPayloadDto,
  ) {
    // Verifica se há um usuario com esse ID
    const oldUser = await this.prismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!oldUser) {
      throw new NotFoundException('Não existe usuário com esse ID');
    }

    if (updatedUser?.password) {
      const hashedPassword = await this.hashingService.hash(
        updatedUser.password,
      );
      updatedUser.password = hashedPassword;
    }

    // Verifica se o user logado(payload) é o mesmo do que está sendo atualizado
    if (tokenPayload.sub !== id) {
      throw new ForbiddenException('User logado não pode atualizar outro user');
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

  // Função para resetar senha
  async updatePassword(email: string, newPassword: string) {
    return this.prismaService.user.update({
      where: {
        email: email,
      },
      data: {
        password: newPassword,
      },
    });
  }

  // Retorna o usuario pelo email
  async getByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: {
        email: email,
      },
    });
  }

  // Deleta o Usuario
  delete(idUser: string, tokenPayload: TokenPayloadDto) {
    // Verifica se o user logado(payload) é o mesmo do que está sendo atualizado
    if (tokenPayload.sub !== idUser) {
      throw new ForbiddenException('User logado não pode atualizar outro user');
    }

    return this.prismaService.user.delete({
      where: {
        id: idUser,
      },
    });
  }
}
