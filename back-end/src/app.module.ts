import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UserAccessTokenStrategy } from './auth/strategies/userAT.strategy';
import { UserRefreshTokenStrategy } from './auth/strategies/userRT.strategy';
import { IntraStrategy } from './auth/strategies/intra.stategy';
import { HelpersModule } from './helpers/helpers.module';
import { TFAStrategy } from './auth/strategies/TFA.strategy';
import { ChatModule } from './chat/chat.module';
import { PrismaModule } from './prisma/prisma.module';
import { MessageModule } from './message/message.module';
import { SearchModule } from './search/search.module';
import { GameModule } from './game/game.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, AuthModule, HelpersModule, ChatModule, PrismaModule, MessageModule, SearchModule, GameModule, LeaderboardModule],
  controllers: [AppController],
  providers: [AppService, UserAccessTokenStrategy, UserRefreshTokenStrategy, IntraStrategy, TFAStrategy],
})
export class AppModule {}
