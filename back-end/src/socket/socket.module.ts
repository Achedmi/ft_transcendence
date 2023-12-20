import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { GameGateway } from './game.gateway';
import { GameModule } from 'src/game/game.module';

@Module({
  imports: [GameModule],
  providers: [ChatGateway, GameGateway],
  exports: [ChatGateway],
})
export class SocketModule {}
