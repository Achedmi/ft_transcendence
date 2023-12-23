import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { GameGateway } from './game.gateway';
import { GameModule } from 'src/game/game.module';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [GameModule, UserModule, JwtModule.register({})],
  providers: [ChatGateway, GameGateway],
  exports: [ChatGateway],
})
export class SocketModule {}
