import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HelpersService } from 'src/helpers/helpers.service';
import { SocketGateway } from 'src/socket/socket.gateway';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly helpersService: HelpersService,
    private readonly socketGateway: SocketGateway,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

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

  async findOneByUsername(id: number, username: string) {
    const { isTFAenabled, TFAsecret, ...user } = await this.prisma.user.findUnique({
      where: { username },
      include: {
        friends: {
          select: {
            id: true,
            username: true,
            avatar: true,
            displayName: true,
          },
        },
      },
    });
    const isFriend = user.friends.some((friend) => friend.id === id);

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

    await this.prisma.user.update({
      where: { id },
      data: { friends: { connect: { id: friendId } } },
    });
    await this.prisma.user.update({
      where: { id: friendId },
      data: { friends: { connect: { id } } },
    });
    return { message: 'Friend added successfully.' };
  }

  async friendsOf(id, username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
      select: {
        friends: {
          select: {
            id: true,
            username: true,
            avatar: true,
            displayName: true,

            friends: { where: { id }, select: { id: true } },
          },
        },
      },
    });
    const friendsWithCommon = user.friends.map((friend) => ({
      ...friend,
      isFriend: friend.friends.length > 0,
    }));
    return friendsWithCommon;
  }

  async unfriend(id: number, friendId: number) {
    await this.prisma.user.update({
      where: { id },
      data: { friends: { disconnect: { id: +friendId } } },
    });
    await this.prisma.user.update({
      where: { id: +friendId },
      data: { friends: { disconnect: { id } } },
    });
    return { message: 'Friend removed successfully.' };
  }

  async me(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user;
  }
}
