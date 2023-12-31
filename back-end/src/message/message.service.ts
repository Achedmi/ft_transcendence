import { ChatGateway } from 'src/socket/chat.gateway';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SendMessageDto } from './dto/create-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendDmDto } from './dto/send-dm.dto';
import { ChatService } from 'src/chat/chat.service';
import { ChatType } from '@prisma/client';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService, private readonly chatService: ChatService, private readonly socketService: ChatGateway) {}
  async sendMessage(from: number, sendMessageDto: SendMessageDto) {
    const chat = await this.prisma.chat.findFirstOrThrow({
      where: { id: sendMessageDto.chatId },
      include: {
        members: {
          where: {
            NOT: {
              id: from,
            },
          },
        },
      },
    });

    const isMuted = await this.chatService.isMuted(from, chat.id);
    if (isMuted) throw new BadRequestException(`You are muted in this chat until ${isMuted}`);

    if (chat.type === ChatType.DM) {
      const blockedBy = await this.chatService.isBlocked(from, chat.members[0].id);
      if (blockedBy) {
        if (blockedBy === from) throw new BadRequestException(`You have blocked this user`);
        else throw new BadRequestException(`You are blocked by this user`);
      }
    }

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

    const blockedBy = await this.chatService.isBlocked(from, sendDmDto.to);
    if (blockedBy) {
      if (blockedBy === from) throw new BadRequestException(`You have blocked this user`);
      else throw new BadRequestException(`You are blocked by this user`);
    }

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

//
