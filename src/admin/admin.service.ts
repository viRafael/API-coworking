import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenPayloadDto } from 'src/auth/dto/token-payload.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prismaService: PrismaService) {}

  // Função para colocar um token como blacklist
  async putTokenOnBlaclist(
    userID: string,
    token: string,
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

    return this.prismaService.blackListTokens.create({
      data: {
        userId: userID,
        token: token,
      },
    });
  }
}
