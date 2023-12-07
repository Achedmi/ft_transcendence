import { Injectable } from '@nestjs/common';
import { sendMessageDto } from './dto/create-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatType, Visibility } from '@prisma/client';
import { SendDmDto } from './dto/send-dm.dto';
import { ChatService } from 'src/chat/chat.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chatService: ChatService,
  ) {}
  async sendMessage(from: number, sendMessageDto: sendMessageDto) {
    const chat = await this.prisma.chat.findFirstOrThrow({
      where: { id: sendMessageDto.chatId },
    });

    return await this.prisma.message.create({
      data: {
        chatId: chat.id,
        content: sendMessageDto.content,
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
    return await this.prisma.message.create({
      data: {
        chatId: chat.id,
        content: sendDmDto.content,
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
