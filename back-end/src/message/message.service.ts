import { ChatGateway } from 'src/socket/chat.gateway';
import { Injectable } from '@nestjs/common';
import { SendMessageDto } from './dto/create-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendDmDto } from './dto/send-dm.dto';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService, private readonly chatService: ChatService, private readonly socketService: ChatGateway) {}
  async sendMessage(from: number, sendMessageDto: SendMessageDto) {
    const chat = await this.prisma.chat.findFirstOrThrow({
      where: { id: sendMessageDto.chatId },
    });

    const message = await this.prisma.message.create({
      data: {
        chatId: chat.id,
        message: sendMessageDto.message,
        userId: from,
      },
    });
    this.socketService.toChat({
      id: message.id,
      chatId: chat.id,
      message: sendMessageDto.message,
      from: from,
    });
    return message;
  }

  async sendDm(from: number, sendDmDto: SendDmDto) {
    let chat: { id: number } = await this.chatService.findDm(from, sendDmDto.to);
    if (!chat) chat = await this.chatService.createDm(from, sendDmDto.to);

    const message = await this.prisma.message.create({
      data: {
        chatId: chat.id,
        message: sendDmDto.message,
        userId: from,
      },
    });

    this.socketService.toChat({
      id: message.id,
      chatId: chat.id,
      message: sendDmDto.message,
      from: from,
    });

    return message;
  }

  async findAll() {
    return await this.prisma.message.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.message.findUnique({ where: { id } });
  }

  async findMessagesInChat(chatId: number) {
    return await this.prisma.message.findMany({ where: { chatId } });
  }
}
