import { SocketModule } from './../socket/socket.module';
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
    const { password, ...user } = await this.prisma.user.create({
      data: createUserDto,
    });
    return user;
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        avatar: true,
        level: true,
        username: true,
        status: true,
        intraId: true,
        createdAt: true,
      },
    });
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
    const { password, ...result } = user;
    return result;
  }

  async update(image, id: number, updateUserDto: UpdateUserDto) {
    if (image) {
      const { url } = await this.cloudinaryService
        .uploadImage(image)
        .catch(() => {
          throw new BadRequestException('Something went wrong.');
        });
      updateUserDto.avatar = url;
    }
    await this.prisma.user.update({
      where: {
        id,
      },
      data: updateUserDto,
    });
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.prisma.user.delete({ where: { id: user.id } });
    return user;
  }
}
