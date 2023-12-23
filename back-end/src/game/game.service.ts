import { Injectable } from '@nestjs/common';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GameService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createGameDto: CreateGameDto) {
    return this.prismaService.game.create({
      data: {
        player1: {
          connect: { id: createGameDto.players[0] },
        },
        player2: {
          connect: { id: createGameDto.players[1] },
        },
      },
    });
  }

  findAll() {
    return `This action returns all game`;
  }

  findOne(id: number) {
    return this.prismaService.game.findUnique({
      where: { id },
      include: {
        player1: true,
        player2: true,
        winnerPlayer: true,
      },
    });
  }

  async update(id: number, updateGameDto: UpdateGameDto) {
    await this.prismaService.game.update({
      where: { id },
      data: {
        player1Score: updateGameDto.player1Score,
        player2Score: updateGameDto.player2Score,
        winnerPlayerId: updateGameDto.winnerPlayer,

        // winnerPlayer: {
        //   connect: { id: updateGameDto.winnerPlayer },
        // },
        status: updateGameDto.status,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
