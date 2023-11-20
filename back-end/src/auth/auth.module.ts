import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtService } from '@nestjs/jwt';
import { HelpersModule } from 'src/helpers/helpers.module';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [UserModule, HelpersModule, SocketModule],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
