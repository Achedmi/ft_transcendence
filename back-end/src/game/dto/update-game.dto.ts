import { PartialType } from '@nestjs/mapped-types';
import { CreateGameDto } from './create-game.dto';
import { GameStatus } from '@prisma/client';

export class UpdateGameDto extends PartialType(CreateGameDto) {
  player1Score: number;
  player2Score: number;
  winnerPlayer: number;
  status?: GameStatus;
}
