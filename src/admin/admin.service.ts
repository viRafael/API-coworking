import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prismaService: PrismaService) {}

  // Função para colocar um token como blacklist
  async putTokenOnBlaclist(userID: string, token: string) {
    return this.prismaService.blackListTokens.create({
      data: {
        userId: userID,
        token: token,
      },
    });
  }
}
