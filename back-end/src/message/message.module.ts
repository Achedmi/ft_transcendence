import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { ChatModule } from 'src/chat/chat.module';
import { SocketModule } from 'src/socket/socket.module';

@Module({
  imports: [ChatModule, SocketModule],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
