import { SocketGateway } from 'src/socket/socket.gateway';
import { Injectable } from '@nestjs/common';
import { SendMessageDto } from './dto/create-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatType, Visibility } from '@prisma/client';
import { SendDmDto } from './dto/send-dm.dto';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chatService: ChatService,
    private readonly socketService: SocketGateway,
  ) {}
  async sendMessage(from: number, sendMessageDto: SendMessageDto) {
    const chat = await this.prisma.chat.findFirstOrThrow({
      where: { id: sendMessageDto.chatId },
    });

    this.socketService.toChat({
      chatId: chat.id,
      message: sendMessageDto.message,
      from: from,
    });
    return await this.prisma.message.create({
      data: {
        chatId: chat.id,
        message: sendMessageDto.message,
        userId: from,
      },
    });
  }

  async sendDm(from: number, sendDmDto: SendDmDto) {
    let chat = await this.chatService.findDm(from, sendDmDto.to);
    if (!chat) {
      chat = await this.chatService.create(from, {
        type: ChatType.DM,
        visibility: Visibility.PRIVATE,
        members: [from, sendDmDto.to],
      });
    }

    this.socketService.toChat({
      chatId: chat.id,
      message: sendDmDto.message,
      from: from,
    });
    return await this.prisma.message.create({
      data: {
        chatId: chat.id,
        message: sendDmDto.message,
        userId: from,
      },
    });
  }

  async findAll() {
    return await this.prisma.message.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.message.findUnique({ where: { id } });
  }
}
