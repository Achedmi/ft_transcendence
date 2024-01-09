import { GameType } from '@prisma/client';

export class CreateGameDto {
  players: number[];
  type: GameType;
}
