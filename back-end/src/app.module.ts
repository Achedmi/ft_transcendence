import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { UserAccessTokenStrategy } from './auth/strategies/userAT.strategy';
import { UserRefreshTokenStrategy } from './auth/strategies/userRT.strategy';
import { IntraStrategy } from './auth/strategies/intra.stategy';
import { HelpersModule } from './helpers/helpers.module';
import { SocketGateway } from './socket/socket.gateway';
import { TFAStrategy } from './auth/strategies/TFA.strategy';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, AuthModule, HelpersModule],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    UserAccessTokenStrategy,
    UserRefreshTokenStrategy,
    IntraStrategy,
    TFAStrategy,
  ],
})
export class AppModule {}
