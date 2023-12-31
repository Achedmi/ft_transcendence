import { BadRequestException, Injectable, Get } from '@nestjs/common';
import { CreateChanneltDto } from './dto/create-channel.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatType, Visibility } from '@prisma/client';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { HelpersService } from 'src/helpers/helpers.service';
import { GiveOwnershipDto } from './dto/giveOwnership.dto';
import { AddAdmindDto } from 'src/chat/dto/addAdmin.dto';
import { RemoveAdminDto } from './dto/removeAdmin.dto';
import { AddMemberDto } from './dto/addMember.dto';
import { KickMemberDto } from './dto/kickMember.dto';
import { MuteDto } from './dto/mute.dto';
import { BlockeDto } from './dto/block.dto';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService, private readonly cloudinaryService: CloudinaryService, private readonly helpersService: HelpersService) {}

  async GetChatById(me: number, id: number) {
    const chat = await this.prisma.chat.findFirstOrThrow({
      where: { id },
      select: {
        id: true,
        name: true,
        image: true,
        visibility: true,
        type: true,
        ownerId: true,
        chatUser: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
                displayName: true,
              },
            },
            isAdmin: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
          include: {
            user: {
              select: {
                avatar: true,
              },
            },
          },
        },
      },
    });

    if (chat.type === ChatType.DM) {
      const otherUser = chat.chatUser.find((chatUser) => chatUser.user.id !== me);
      chat.name = otherUser.user.displayName;
      chat['username'] = otherUser.user.username;
      chat.image = otherUser.user.avatar;
    }

    const members = {};
    chat.chatUser.forEach((chatUser) => {
      members[chatUser.user.id] = chatUser;
    });
    chat['members'] = members;

    return chat;
  }

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
      include: {
        messages: {
          include: {
            user: {
              select: {
                username: true,
                avatar: true,
                displayName: true,
              },
            },
          },
        },
      },
    });
  }

  async getDms(me: number) {
    return await this.prisma.chat.findMany({
      where: {
        type: ChatType.DM,
        members: {
          some: {
            id: me,
          },
        },
      },
      select: {
        id: true,
        type: true,
        visibility: true,
        members: {
          where: {
            id: {
              not: me,
            },
          },
          select: {
            id: true,
            username: true,
            avatar: true,
            displayName: true,
          },
        },
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
    });
  }

  async getChannels(me: number) {
    return await this.prisma.chat.findMany({
      where: {
        type: ChatType.CHANNEL,
        members: {
          some: {
            id: me,
          },
        },
      },
      select: {
        id: true,
        type: true,
        visibility: true,
        image: true,
        name: true,
        members: {
          select: {
            id: true,
            username: true,
            avatar: true,
            displayName: true,
          },
        },
        messages: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  async createChannel(owner: number, createChatDto: CreateChanneltDto, image: File) {
    if (createChatDto.visibility === Visibility.PROTECTED && !createChatDto.password) throw new BadRequestException('Password is required for protected chats');
    else if (createChatDto.visibility !== Visibility.PROTECTED && createChatDto.password) throw new BadRequestException('You can not set a password for this chat');
    const { url } = await this.cloudinaryService.uploadImage(image).catch(() => {
      throw new BadRequestException('Something went wrong.');
    });
    createChatDto.password = await this.helpersService.hashPassword(createChatDto.password);
    return await this.prisma.chat.create({
      data: {
        ...createChatDto,
        members: {
          connect: { id: owner },
        },
        owner: {
          connect: { id: owner },
        },
        chatUser: {
          create: { isAdmin: true, userId: owner },
        },
        visibility: createChatDto.visibility,
        type: ChatType.CHANNEL,
        image: url,
      },
    });
  }

  async isAdminOrOwner(me: number, chatId: number) {
    const isOwner = await this.isOwner(me, chatId);
    const isAdmin = await this.isAdmin(me, chatId);
    return isAdmin || isOwner;
  }

  async updateChannel(me: number, id: number, updateChatDto: UpdateChatDto, image?: File) {
    const isAbleToUpdate = await this.isAdminOrOwner(me, id);
    if (!isAbleToUpdate) throw new BadRequestException('You are not the owner or the Admin of this chat');
    if (updateChatDto.visibility === Visibility.PROTECTED && !updateChatDto.password) throw new BadRequestException('Password is required for protected chats');

    const chat = await this.prisma.chat.findFirst({
      where: { id },
    });

    if (chat.visibility !== Visibility.PROTECTED && updateChatDto.password && updateChatDto.visibility !== Visibility.PROTECTED)
      throw new BadRequestException('You can not set a password for this chat');
    else if (updateChatDto.visibility && updateChatDto.visibility != Visibility.PROTECTED) updateChatDto.password = null;

    let imageUrl;
    if (image) {
      const { url } = await this.cloudinaryService.uploadImage(image).catch(() => {
        throw new BadRequestException('Something went wrong.');
      });
      imageUrl = url;
    }

    updateChatDto.password = await this.helpersService.hashPassword(updateChatDto.password);
    return await this.prisma.chat.update({
      where: { id },
      data: {
        ...updateChatDto,
        image: imageUrl,
      },
    });
  }

  async createDm(me: number, friendId: number) {
    if (me === friendId) throw new BadRequestException('You can not create a dm with yourself');
    return await this.prisma.chat.create({
      data: {
        type: ChatType.DM,
        visibility: Visibility.PRIVATE,
        members: {
          connect: [{ id: me }, { id: friendId }],
        },
        chatUser: {
          create: [{ userId: me }, { userId: friendId }],
        },
      },
    });
  }

  async isOwner(id: number, chatId: number) {
    const chat = await this.prisma.chat.findFirstOrThrow({
      where: {
        id: chatId,
      },
      select: {
        ownerId: true,
      },
    });
    return chat?.ownerId === id;
  }

  async isUserInChat(id: number, chatId: number) {
    const chat = await this.prisma.userChat.findFirst({
      where: {
        chat: {
          id: chatId,
          members: {
            some: {
              id,
            },
          },
        },
      },
    });
    return chat;
  }

  async giveOwnership(me: number, giveOwnershipDto: GiveOwnershipDto) {
    if (me === giveOwnershipDto.userId) throw new BadRequestException('You can not give yourself ownership');
    const isOwner = await this.isOwner(me, giveOwnershipDto.chatId);
    if (!isOwner) throw new BadRequestException('You are not the owner of this chat');
    const isUserInChat = await this.isUserInChat(giveOwnershipDto.userId, giveOwnershipDto.chatId);
    if (!isUserInChat) throw new BadRequestException('User is not in this chat');

    return await this.prisma.chat.update({
      where: { id: giveOwnershipDto.chatId },
      data: {
        owner: {
          connect: { id: giveOwnershipDto.userId },
        },
      },
    });
  }

  async isAdmin(id: number, chatId: number) {
    const chat = await this.prisma.userChat.findFirstOrThrow({
      where: {
        chatId: chatId,
        userId: id,
      },
      select: {
        isAdmin: true,
      },
    });
    return chat.isAdmin;
  }

  async addAdmin(me: number, addAdminDto: AddAdmindDto) {
    if (me === addAdminDto.userId) throw new BadRequestException('You can not add yourself');
    const isAbleto = await this.isAdminOrOwner(me, addAdminDto.chatId);
    if (!isAbleto) throw new BadRequestException('You are not the owner or the Admin of this chat');
    const isUserInChat = await this.isUserInChat(addAdminDto.userId, addAdminDto.chatId);
    if (!isUserInChat) throw new BadRequestException('User is not in this chat');
    return await this.prisma.userChat.update({
      where: {
        userId_chatId: {
          userId: addAdminDto.userId,
          chatId: addAdminDto.chatId,
        },
      },
      data: {
        isAdmin: true,
      },
    });
  }

  async removeAdmin(me: number, remvoeAdminDto: RemoveAdminDto) {
    if (me === remvoeAdminDto.userId) throw new BadRequestException('You can not remove yourself');
    const isAbleto = await this.isAdminOrOwner(me, remvoeAdminDto.chatId);
    if (!isAbleto) throw new BadRequestException('You are not the owner or the Admin of this chat');
    const isUserInChat = await this.isUserInChat(remvoeAdminDto.userId, remvoeAdminDto.chatId);
    if (!isUserInChat) throw new BadRequestException('User is not in this chat');

    return await this.prisma.userChat.update({
      where: {
        userId_chatId: {
          userId: remvoeAdminDto.userId,
          chatId: remvoeAdminDto.chatId,
        },
      },
      data: {
        isAdmin: false,
      },
    });
  }

  async addMember(me: number, addMemberDto: AddMemberDto) {
    if (me === addMemberDto.userId) throw new BadRequestException('You can not add yourself');
    const isAbleto = await this.isAdminOrOwner(me, addMemberDto.chatId);
    if (!isAbleto) throw new BadRequestException('You are not the owner or the Admin of this chat');
    await this.prisma.userChat.create({
      data: {
        userId: addMemberDto.userId,
        chatId: addMemberDto.chatId,
      },
    });

    return await this.prisma.chat.update({
      where: { id: addMemberDto.chatId },
      data: {
        members: {
          connect: {
            id: addMemberDto.userId,
          },
        },
      },
    });
  }

  async kickMember(me: number, kickMemberDto: KickMemberDto) {
    if (me === kickMemberDto.userId) throw new BadRequestException('You can not kick yourself');

    const isAbleto = await this.isAdminOrOwner(me, kickMemberDto.chatId);
    if (!isAbleto) throw new BadRequestException('You are not the owner or the Admin of this chat');

    const isOwner = await this.isOwner(kickMemberDto.userId, kickMemberDto.chatId);
    if (isOwner) throw new BadRequestException('You can not kick the owner of this chat');

    const isUserInChat = await this.isUserInChat(kickMemberDto.userId, kickMemberDto.chatId);
    if (!isUserInChat) throw new BadRequestException('User is not in this chat');

    const chat = await this.prisma.userChat.delete({
      where: {
        userId_chatId: {
          userId: kickMemberDto.userId,
          chatId: kickMemberDto.chatId,
        },
      },
    });
    await this.prisma.chat.update({
      where: { id: kickMemberDto.chatId },
      data: {
        members: {
          disconnect: {
            id: kickMemberDto.userId,
          },
        },
      },
    });
    return chat;
  }

  async findAll() {
    return await this.prisma.chat.findMany();
  }

  async findAllByChatType(me: number, type: ChatType) {
    return await this.prisma.chat.findMany({ where: { type } });
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }

  async isMuted(me: number, chatId: number) {
    const chat = await this.prisma.userChat.findFirstOrThrow({
      where: {
        userId: me,
        chatId,
      },
      select: {
        isMuted: true,
        mutedUntil: true,
      },
    });
    if (chat.isMuted && chat.mutedUntil >= new Date()) return chat.mutedUntil;
    else if (chat.isMuted && chat.mutedUntil <= new Date()) {
      await this.prisma.userChat.update({
        where: {
          userId_chatId: {
            userId: me,
            chatId,
          },
        },
        data: {
          isMuted: false,
          mutedUntil: null,
        },
      });
    }
    return false;
  }

  async mute(me: number, muteDto: MuteDto) {
    if (me === muteDto.userId) throw new BadRequestException('You can not mute yourself');

    const isAbleto = await this.isAdminOrOwner(me, muteDto.chatId);
    if (!isAbleto) throw new BadRequestException('You are not the owner or the Admin of this chat');

    const isUserInChat = await this.isUserInChat(muteDto.userId, muteDto.chatId);
    if (!isUserInChat) throw new BadRequestException('User is not in this chat');

    const isOwnerOrAdmin = await this.isOwner(muteDto.userId, muteDto.chatId);
    if (isOwnerOrAdmin) throw new BadRequestException('You can not mute the owner or an admin of this chat');

    if (muteDto.time > 20) throw new BadRequestException('You can not mute for more than 20 minutes');

    const mutedUntil = new Date();
    mutedUntil.setMinutes(mutedUntil.getMinutes() + muteDto.time);

    return await this.prisma.userChat.update({
      where: {
        userId_chatId: {
          userId: muteDto.userId,
          chatId: muteDto.chatId,
        },
      },
      data: {
        mutedUntil,
        isMuted: true,
      },
    });
  }

  async block(me: number, blockDto: BlockeDto) {
    if (me === blockDto.userId) throw new BadRequestException('You can not block yourself');

    return await this.prisma.blocking.create({
      data: {
        user1Id: me,
        user2Id: blockDto.userId,
        BlockedById: me,
      },
    });
  }

  async unblock(me: number, blockDto: BlockeDto) {
    if (me === blockDto.userId) throw new BadRequestException('You can not unblock yourself');

    const blockedBy = await this.prisma.blocking.findUnique({
      where: {
        user1Id_user2Id: {
          user1Id: me,
          user2Id: blockDto.userId,
        },
        BlockedById: me,
      },
    });
    if (!blockedBy) throw new BadRequestException('You have not blocked this user');

    return await this.prisma.blocking.delete({
      where: {
        user1Id_user2Id: {
          user1Id: me,
          user2Id: blockDto.userId,
        },
      },
    });
  }

  async isBlocked(me: number, userId: number) {
    const blockedBy = await this.prisma.blocking.findUnique({
      where: {
        user1Id_user2Id: {
          user1Id: me,
          user2Id: userId,
        },
      },
    });
    return blockedBy;
  }
}
