import { ChatGateway } from 'src/socket/chat.gateway';
import { BadRequestException, Injectable } from '@nestjs/common';
import { SendMessageDto } from './dto/create-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SendDmDto } from './dto/send-dm.dto';
import { ChatService } from 'src/chat/chat.service';
import { ChatType } from '@prisma/client';
import { UserService } from 'src/user/user.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly chatService: ChatService,
    private readonly socketService: ChatGateway,
    private readonly userService: UserService,
  ) {}
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

    const blockedUsers = await this.userService.blockedUsers(from);

    const isMuted = await this.chatService.isMuted(from, chat.id);
    if (isMuted) throw new BadRequestException(`muted until ${isMuted}`);

    if (chat.type === ChatType.DM) {
      const blockedBy = await this.userService.isBlocked(from, chat.members[0].id);
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
      include: {
        user: {
          select: {
            avatar: true,
            id: true,
          },
        },
      },
    });
    message['blockedUsers'] = blockedUsers;
    this.socketService.toChat(message, chat.id);
    return message;
  }

  async sendDm(from: number, sendDmDto: SendDmDto) {
    const blockedBy = await this.userService.isBlocked(from, sendDmDto.to);
    if (blockedBy) {
      if (blockedBy === from) throw new BadRequestException(`You have blocked this user`);
      else throw new BadRequestException(`You are blocked by this user`);
    }
    let chat: { id: number } = await this.chatService.findDm(from, sendDmDto.to);
    if (!chat) chat = await this.chatService.createDm(from, sendDmDto.to);

    const blockedUsers = await this.userService.blockedUsers(from);
    const message = await this.prisma.message.create({
      data: {
        chatId: chat.id,
        message: sendDmDto.message,
        userId: from,
      },
      include: {
        user: {
          select: {
            avatar: true,
            id: true,
          },
        },
      },
    });

    message['blockedUsers'] = blockedUsers;
    this.socketService.toChat(message, sendDmDto.to);

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
