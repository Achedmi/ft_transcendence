import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { HelpersModule } from 'src/helpers/helpers.module';
import { SocketModule } from 'src/socket/socket.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [CloudinaryModule, HelpersModule, SocketModule, UserModule],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
