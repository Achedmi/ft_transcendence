import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatType, Visibility } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async findDm(from: number, to: number) {
    return await this.prisma.chat.findFirst({
      where: {
        type: ChatType.DM,
        members: {
          every: {
            id: {
              in: [from, to],
            },
          },
        },
      },
    });
  }

  async create(owner: number, createChatDto: CreateChatDto) {
    if (createChatDto.type === ChatType.DM && createChatDto.visibility != Visibility.PRIVATE) throw new BadRequestException('DMs must be private');
    createChatDto.members.push(owner);
    return await this.prisma.chat.create({
      data: {
        ...createChatDto,
        members: {
          connect: createChatDto.members.map((member) => ({ id: member })),
        },
        owner: {
          connect: { id: owner },
        },
      },
    });
  }

  async findAll() {
    return await this.prisma.chat.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.chat.findUnique({ where: { id } });
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
