import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { HelpersModule } from 'src/helpers/helpers.module';

@Module({
  imports: [CloudinaryModule, HelpersModule],
  controllers: [ChatController],
  providers: [ChatService],
  exports: [ChatService],
})
export class ChatModule {}
