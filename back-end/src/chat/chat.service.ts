import { joinChannel } from './dto/joinChannel.dto';
import { BadRequestException, Injectable, Get, NotFoundException } from '@nestjs/common';
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
import { BanMemberDto } from './dto/banMember.dto';
import * as bcrypt from 'bcrypt';
import { ChatGateway } from 'src/socket/chat.gateway';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly helpersService: HelpersService,
    private readonly socketService: ChatGateway,
    private readonly userService: UserService,
  ) {}

  async GetChatById(me: number, id: number) {
    const blockedUsers = new Set();
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
                id: true,
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
    const blocking = await this.getBlockedAndBlockedBe(me);
    chat.chatUser.map(async (chatUser) => {
      if (blocking.includes(chatUser.user.id) && chat.type === ChatType.CHANNEL) blockedUsers.add(chatUser.user.id);
      members[chatUser.user.id] = chatUser;
    });
    chat.messages.map((message) => {
      if (blockedUsers.has(message.user.id)) message.message = 'Redacted';
    });

    chat['members'] = members;

    return chat;
  }

  async getChatMessages(me, id, skip?: number) {
    const messages = await this.prisma.message.findMany({
      where: { chatId: id },
      orderBy: {
        createdAt: 'desc',
      },
      skip: skip || 0,
      include: {
        user: {
          select: {
            avatar: true,
            id: true,
          },
        },
      },
    });

    const blocking = await this.getBlockedAndBlockedBe(me);
    messages.forEach((message) => {
      if (blocking.includes(message.userId)) message.message = 'Redacted';
    });

    return messages.reverse();
  }

  async getChatMembers(id) {
    const chat = await this.prisma.$queryRaw`
    SELECT
      "UserChat"."userId", "UserChat"."chatId", "isAdmin", "isMuted", "User".username, "User".avatar, "displayName", CASE WHEN
      "User".id = "Chat"."ownerId" THEN 'true'
      ELSE 'false'
      END as isOwner
    FROM
      "UserChat"
      INNER JOIN "User" ON "UserChat"."userId" = "User".id
      INNER JOIN "Chat" ON "Chat".id = "UserChat"."chatId"
    WHERE
	"UserChat"."chatId" = ${id};
    `;
    return chat;
  }

  async getChatInfos(me, id) {
    const chat = await this.prisma.chat.findUnique({
      where: { id },
    });
    if (chat) {
      chat['members'] = await this.getChatMembers(id);
      if (chat.type === ChatType.DM) {
        const otherUser = chat['members'].find((member) => member.userId !== me);
        chat.name = otherUser?.displayName;
        chat['username'] = otherUser?.username;
        chat.image = otherUser?.avatar;
        chat['isBlocked'] = await this.userService.isBlocked(me, otherUser?.userId);
      }
      const { password, ...rest } = chat;
      return rest;
    } else return {};
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
    const channles = await this.prisma.chat.findMany({
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
    await Promise.all(
      channles.map(async (channel) => {
        if (channel.messages.length === 0) return;
        const isLastMessageFromBlockedUser = await this.userService.isBlocked(me, channel.messages[0].userId);
        if (isLastMessageFromBlockedUser) channel.messages[0].message = 'Redacted';
      }),
    );
    return channles;
  }

  async createChannel(owner: number, createChatDto: CreateChanneltDto, image: File) {
    if (createChatDto.visibility === Visibility.PROTECTED && !createChatDto.password) throw new BadRequestException('Password is required for protected chats');
    else if (createChatDto.visibility !== Visibility.PROTECTED && createChatDto.password) throw new BadRequestException('You can not set a password for this chat');
    let url;
    if (image) {
      url = (
        await this.cloudinaryService.uploadImage(image).catch(() => {
          throw new BadRequestException('Something went wrong.');
        })
      ).url;
    } else url = 'https://res.cloudinary.com/dwrysd8sm/image/upload/v1704553895/group_atuz74.png';
    createChatDto.password = await this.helpersService.hashPassword(createChatDto.password);

    
    const chat =  await this.prisma.chat.create({
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
    this.socketService.addMemberToChat(owner, chat.id)
    return chat;
  }

  async isAdminOrOwner(me: number, chatId: number) {
    const isOwner = await this.isOwner(me, chatId);
    const isAdmin = await this.isAdmin(me, chatId);
    return isAdmin || isOwner;
  }

  async updateChannel(me: number, id: number, updateChatDto: UpdateChatDto, image?: File) {
    const isAbleToUpdate = await this.isOwner(me, id);
    if (!isAbleToUpdate) throw new BadRequestException('You are not the owner of this chat');
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
    await this.prisma.chat.update({
      where: { id },
      data: {
        ...updateChatDto,
        image: imageUrl,
      },
    });

    const infos = await this.getChatInfos(me, id);
    this.socketService.chatUpdated(id, infos);
    return infos;
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
    const chat = await this.prisma.chat.findFirst({
      where: {
        id: chatId,
        members: {
          some: {
            id,
          },
        },
      },
      include: {
        members: true,
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

    await this.prisma.chat.update({
      where: { id: giveOwnershipDto.chatId },
      data: {
        owner: {
          connect: { id: giveOwnershipDto.userId },
        },
      },
    });

    await this.prisma.userChat.update({
      where: {
        userId_chatId: {
          userId: giveOwnershipDto.userId,
          chatId: giveOwnershipDto.chatId,
        },
      },
      data: {
        isAdmin: true,
      },
    });

    const infos = await this.getChatInfos(me, giveOwnershipDto.chatId);
    this.socketService.chatUpdated(giveOwnershipDto.chatId, infos);
    return infos;
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
    const isAbleto = await this.isOwner(me, addAdminDto.chatId);
    if (!isAbleto) throw new BadRequestException('You are not the owner of this chat');
    const isUserInChat = await this.isUserInChat(addAdminDto.userId, addAdminDto.chatId);
    if (!isUserInChat) throw new BadRequestException('User is not in this chat');
    await this.prisma.userChat.update({
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
    const infos = await this.getChatInfos(me, addAdminDto.chatId);
    this.socketService.chatUpdated(addAdminDto.chatId, infos);
    return infos;
  }

  async removeAdmin(me: number, remvoeAdminDto: RemoveAdminDto) {
    if (me === remvoeAdminDto.userId) throw new BadRequestException('You can not remove yourself');
    const isAbleto = await this.isAdminOrOwner(me, remvoeAdminDto.chatId);
    if (!isAbleto) throw new BadRequestException('You are not the owner or the Admin of this chat');
    const isUserInChat = await this.isUserInChat(remvoeAdminDto.userId, remvoeAdminDto.chatId);
    if (!isUserInChat) throw new BadRequestException('User is not in this chat');

    await this.prisma.userChat.update({
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
    const infos = await this.getChatInfos(me, remvoeAdminDto.chatId);
    this.socketService.chatUpdated(remvoeAdminDto.chatId, infos);
    return infos;
  }

  async addMember(me: number, addMemberDto: AddMemberDto) {
    if (me === addMemberDto.userId) throw new BadRequestException('You can not add yourself');
    const isAbleto = await this.isAdminOrOwner(me, addMemberDto.chatId);
    if (!isAbleto) throw new BadRequestException('You are not the owner or the Admin of this chat');

    const isUserInChat = await this.isUserInChat(addMemberDto.userId, addMemberDto.chatId);
    if (isUserInChat) throw new BadRequestException('User is already in this chat');

    const isBanned = await this.isBanned(addMemberDto.userId, addMemberDto.chatId);
    if (isBanned) throw new BadRequestException('User is banned from this chat');

    await this.prisma.userChat.create({
      data: {
        userId: addMemberDto.userId,
        chatId: addMemberDto.chatId,
      },
    });

    await this.prisma.chat.update({
      where: { id: addMemberDto.chatId },
      data: {
        members: {
          connect: {
            id: addMemberDto.userId,
          },
        },
      },
    });
    this.socketService.addMemberToChat( addMemberDto.userId,  addMemberDto.chatId );
    const infos = await this.getChatInfos(me, addMemberDto.chatId);
    this.socketService.chatUpdated(addMemberDto.chatId, infos);
    return infos;
  }

  async kickMember(me: number, kickMemberDto: KickMemberDto) {
    if (me === kickMemberDto.userId) {
      const isOwner = await this.isOwner(me, kickMemberDto.chatId);
      if (isOwner) throw new BadRequestException('Give ownership to someone else before leaving');
    }

    if (me !== kickMemberDto.userId) {
      const isAbleto = await this.isAdminOrOwner(me, kickMemberDto.chatId);
      if (!isAbleto) throw new BadRequestException('You are not the owner or the Admin of this chat');

      const isOwner = await this.isOwner(kickMemberDto.userId, kickMemberDto.chatId);
      if (isOwner) throw new BadRequestException('You can not kick the owner of this chat');

      const isUserInChat = await this.isUserInChat(kickMemberDto.userId, kickMemberDto.chatId);
      if (!isUserInChat) throw new BadRequestException('User is not in this chat');
    }

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

    const infos = await this.getChatInfos(me, kickMemberDto.chatId);
    this.socketService.chatUpdated(kickMemberDto.chatId, infos);
    return infos;
  }
  async banMember(me: number, banMemberDto: BanMemberDto) {
    if (me === banMemberDto.userId) throw new BadRequestException('You can not ban yourself');

    const isAbleto = await this.isAdminOrOwner(me, banMemberDto.chatId);
    if (!isAbleto) throw new BadRequestException('You are not the owner or the Admin of this chat');

    const isOwner = await this.isOwner(banMemberDto.userId, banMemberDto.chatId);
    if (isOwner) throw new BadRequestException('You can not ban the owner of this chat');

    const isUserInChat = await this.isUserInChat(banMemberDto.userId, banMemberDto.chatId);
    if (!isUserInChat) throw new BadRequestException('User is not in this chat');

    await this.prisma.chat.update({
      where: { id: banMemberDto.chatId },
      data: {
        bannedUsers: {
          connect: {
            id: banMemberDto.userId,
          },
        },
        members: {
          disconnect: {
            id: banMemberDto.userId,
          },
        },
      },
    });

    await this.prisma.userChat.delete({
      where: {
        userId_chatId: {
          userId: banMemberDto.userId,
          chatId: banMemberDto.chatId,
        },
      },
    });

    const infos = await this.getChatInfos(me, banMemberDto.chatId);
    this.socketService.chatUpdated(banMemberDto.chatId, infos);
    return infos;
  }

  async unbanMember(me: number, unbanMemberDto: BanMemberDto) {
    if (me === unbanMemberDto.userId) throw new BadRequestException('You can not unban yourself');

    const isAbleto = await this.isAdminOrOwner(me, unbanMemberDto.chatId);
    if (!isAbleto) throw new BadRequestException('You are not the owner or the Admin of this chat');

    // const isUserInChat = await this.isUserInChat(unbanMemberDto.userId, unbanMemberDto.chatId);
    // if (!isUserInChat) throw new BadRequestException('User is not in this chat');

    await this.prisma.chat.update({
      where: { id: unbanMemberDto.chatId },
      data: {
        bannedUsers: {
          disconnect: {
            id: unbanMemberDto.userId,
          },
        },
      },
    });

    // return await this.getChatInfos(me, unbanMemberDto.chatId);
    const infos = await this.getChatInfos(me, unbanMemberDto.chatId);
    this.socketService.chatUpdated(unbanMemberDto.chatId, infos);
    return infos;
  }

  async isBanned(me: number, chatId: number) {
    const chat = await this.prisma.chat.findUnique({
      where: {
        id: chatId,
        bannedUsers: {
          some: {
            id: me,
          },
        },
      },
    });
    return chat;
  }

  async joinChannel(me: number, joinChannelDto: joinChannel) {
    const chat = await this.prisma.chat.findFirst({
      where: {
        id: joinChannelDto.channelId,
      },
    });
    if (!chat) throw new NotFoundException('Chat not found');
    if (chat.visibility === Visibility.PRIVATE) throw new BadRequestException('This chat is private');
    if (chat.visibility === Visibility.PROTECTED && !joinChannelDto.password) throw new BadRequestException('Password is required for protected chats');
    const isBanned = await this.isBanned(me, joinChannelDto.channelId);
    if (isBanned) throw new BadRequestException('You are banned from this chat');
    if (chat.visibility === Visibility.PROTECTED && joinChannelDto.password) {
      const isPasswordCorrect = await bcrypt.compare(joinChannelDto.password, chat.password);
      if (!isPasswordCorrect) throw new BadRequestException('Wrong password');
    }
    const isUserInChat = await this.isUserInChat(me, joinChannelDto.channelId);
    if (isUserInChat) throw new BadRequestException('You are already in this chat');


    await this.prisma.userChat.create({
      data: {
        userId: me,
        chatId: joinChannelDto.channelId,
      },
    });
    await this.prisma.chat.update({
      where: { id: joinChannelDto.channelId },
      data: {
        members: {
          connect: {
            id: me,
          },
        },
      },
    });
    this.socketService.addMemberToChat(me, joinChannelDto.channelId)
    const infos = await this.getChatInfos(me, joinChannelDto.channelId);
    this.socketService.chatUpdated(joinChannelDto.channelId, infos);
    return infos;
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
    //return how many minutes left
    if (chat.isMuted && chat.mutedUntil >= new Date()) return chat.mutedUntil.toLocaleTimeString();
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

    await this.prisma.userChat.update({
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

    const infos = await this.getChatInfos(me, muteDto.chatId);
    this.socketService.chatUpdated(muteDto.chatId, infos);
    return infos;
  }

  async getBlockedAndBlockedBe(me: number) {
    const blocked = await this.prisma.blocking.findMany({
      where: {
        OR: [
          {
            user1Id: me,
          },
          {
            user2Id: me,
          },
        ],
      },
      select: {
        user1: {
          where: {
            NOT: {
              id: me,
            },
          },
          select: {
            id: true,
            username: true,
            avatar: true,
            displayName: true,
          },
        },
        user2: {
          where: {
            NOT: {
              id: me,
            },
          },
          select: {
            id: true,
            username: true,
            avatar: true,
            displayName: true,
          },
        },
      },
    });
    return blocked.map((block) => {
      if (block.user1) return block.user1.id;
      else return block.user2.id;
    });
  }
}
