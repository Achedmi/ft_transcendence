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
    return `This action returns a #${id} game`;
  }

  update(id: number, updateGameDto: UpdateGameDto) {
    return `This action updates a #${id} game`;
  }

  remove(id: number) {
    return `This action removes a #${id} game`;
  }
}
