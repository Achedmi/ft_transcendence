import { BadRequestException, Injectable } from '@nestjs/common';
import { SearchDto } from './dto/search.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatType, Visibility } from '@prisma/client';

@Injectable()
export class SearchService {
  constructor(private readonly prismaService: PrismaService) {}

  async globalSearch(searchDto: SearchDto) {
    const response = { users: [], chat: [] };
    if (!searchDto.type || searchDto.type === 'users') {
      response.users = await this.prismaService.user.findMany({
        take: 10,
        where: {
          username: {
            contains: searchDto.search,
          },
        },
      });
    }

    if (!searchDto.type || searchDto.type === 'chat') {
      response.chat = await this.prismaService.chat.findMany({
        take: 10,
        where: {
          name: {
            contains: searchDto.search,
          },
          OR: [{ visibility: Visibility.PROTECTED }, { visibility: Visibility.PUBLIC }],
        },
      });
    }
    return response;
  }
}
