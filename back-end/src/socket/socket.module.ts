import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { GameGateway } from './game.gateway';

@Module({
  providers: [ChatGateway, GameGateway],
  exports: [ChatGateway],
})
export class SocketModule {}
