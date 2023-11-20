import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserATGuard } from 'src/auth/guards/userATGuard.guard';
import { GetCurrent } from 'src/auth/decorator/current.decorator';
import { HelpersService } from 'src/helpers/helpers.service';
import { Response } from 'express';
import { User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly helpersService: HelpersService,
  ) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @UseGuards(UserATGuard)
  @Patch()
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @GetCurrent('id') id: number,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.userService.update(id, updateUserDto);
    const user = await this.userService.findOne(id);
    const { accessToken, refreshToken } =
      await this.helpersService.generateRefreshAndAccessToken({
        id: user.id,
        username: user.username,
      });
    response.cookie('userAT', accessToken, {
      httpOnly: true,
    });
    response.cookie('userRT', refreshToken, {
      httpOnly: true,
    });
    return user;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get('me')
  @UseGuards(UserATGuard)
  async me(@GetCurrent() user: User) {
    return user;
  }
}
