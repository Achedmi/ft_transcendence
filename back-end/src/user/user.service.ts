import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Status } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService, private readonly cloudinaryService: CloudinaryService) {}

  async create(createUserDto: CreateUserDto) {
    return await this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findUnique(data) {
    return await this.prisma.user.findUnique({ where: data });
  }

  async isFriendWithMe(id: number, friendId: number) {
    const friendship = await this.prisma.friendship.findFirst({
      where: {
        OR: [
          { user1Id: id, user2Id: friendId },
          { user1Id: friendId, user2Id: id },
        ],
      },
    });
    return friendship ? true : false;
  }

  async getUserFriendsByUsername(me: number, username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        friendship1: { include: { user2: { select: { username: true, displayName: true, avatar: true, id: true, bio: true } } } },
        friendship2: { include: { user1: { select: { username: true, displayName: true, avatar: true, id: true, bio: true } } } },
      },
    });

    const friends2 = user.friendship2.map((friendship) => friendship.user1);
    const friends1 = user.friendship1.map((friendship) => friendship.user2);
    const friends = await Promise.all(
      [...friends1, ...friends2].map(async (friend) => ({
        ...friend,
        isFriend: await this.isFriendWithMe(me, friend.id),
      })),
    );
    return friends;
  }

  async getUserFriendsById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        friendship1: { include: { user2: { select: { username: true, displayName: true, avatar: true, id: true, bio: true } } } },
        friendship2: { include: { user1: { select: { username: true, displayName: true, avatar: true, id: true, bio: true } } } },
      },
    });
    const friends1 = user.friendship1.map((friendship) => friendship.user2);
    const friends2 = user.friendship2.map((friendship) => friendship.user1);

    const friends = [...friends1, ...friends2];
    return friends;
  }

  async findOneByUsername(id: number, username: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { username },
      select: {
        username: true,
        avatar: true,
        displayName: true,
        id: true,
        bio: true,
      },
    });
    user['friends'] = await this.getUserFriendsByUsername(id, username);
    const isFriend = user['friends'].some((friend) => friend.id === id || friend.id === id);

    return { ...user, isFriend };
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUniqueOrThrow({ where: { id } });
    return user;
  }

  async update(
    image,
    id: number,
    updateUserDto: UpdateUserDto & {
      TFAsecret?: string;
      isTFAenabled?: boolean;
    },
  ) {
    if (image) {
      const { url } = await this.cloudinaryService.uploadImage(image).catch(() => {
        throw new BadRequestException('Something went wrong.');
      });
      updateUserDto.avatar = url;
    }
    const { TFAsecret, ...user } = await this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
    return user;
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.prisma.user.delete({ where: { id: user.id } });
    return user;
  }

  async addFriend(id: number, friendId: number) {
    if (id == friendId) {
      throw new BadRequestException('You cannot add yourself as a friend.');
    }

    await this.prisma.friendship.create({
      data: {
        user1Id: id,
        user2Id: friendId,
      },
    });

    return { message: 'Friend added successfully.' };
  }

  async unfriend(id: number, friendId: number) {
    if (id == friendId) {
      throw new BadRequestException('You cannot unfriend yourself.');
    }
    await this.prisma.friendship.deleteMany({
      where: {
        OR: [
          { user1Id: id, user2Id: friendId },
          { user1Id: friendId, user2Id: id },
        ],
      },
    });
    return { message: 'Friend removed successfully.' };
  }

  async updateUserStatus(id: number, status: Status) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { status },
    });
    return user;
  }

  async me(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user;
  }

  async setMeOnline(id: number) {
    await this.prisma.user.update({
      where: { id },
      data: { status: Status.ONLINE },
    });
  }

  async isAbleToPlay(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { status: true },
    });
    return user.status === Status.ONLINE;
  }
}
