import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { ChatModule } from 'src/chat/chat.module';
import { SocketModule } from 'src/socket/socket.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [ChatModule, SocketModule, UserModule],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
