import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { HelpersModule } from 'src/helpers/helpers.module';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [HelpersModule, SocketModule],
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class UserModule {}
