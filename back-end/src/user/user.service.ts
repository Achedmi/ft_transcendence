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

  async findOneByUsername(username: string) {
    return await this.prisma.user.findUniqueOrThrow({
      where: { username },
    });
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
      const { url } = await this.cloudinaryService
        .uploadImage(image)
        .catch(() => {
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
    if (id === friendId) {
      throw new BadRequestException('You cannot add yourself as a friend.');
    }

    await this.prisma.user.update({
      where: { id },
      data: { friends: { connect: { id: +friendId } } },
    });
    await this.prisma.user.update({
      where: { id: +friendId },
      data: { friends: { connect: { id } } },
    });
    return { message: 'Friend added successfully.' };
  }

  async friendsOf(username: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { username },
      include: { friends: true },
    });
    return user.friends;
  }
}
