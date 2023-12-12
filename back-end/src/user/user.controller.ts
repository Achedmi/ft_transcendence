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
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetCurrent } from 'src/auth/decorator/current.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { TFAGuard } from 'src/auth/guards/TFAGuard.guard';
import { AddFriendDto } from './dto/addFriend.dto';

@Controller('user')
@UseGuards(TFAGuard)
// @UseGuards(UserATGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseInterceptors(FileInterceptor('image'))
  @Patch()
  async update(
    @GetCurrent('id') id,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }), new MaxFileSizeValidator({ maxSize: 24000000 })],
        fileIsRequired: false,
      }),
    )
    image,
  ) {
    return await this.userService.update(image, id, updateUserDto);
  }

  @Post('addFriend/:friendId')
  async addFriend(@GetCurrent('id') id: number, @Param() addFriendDto: AddFriendDto) {
    return await this.userService.addFriend(id, addFriendDto.friendId);
  }

  @Get('friendsOf/:username')
  async friendsOf(@GetCurrent('id') id: number, @Param('username') username: string) {
    return await this.userService.getUserFriendsByUsername(id, username);
  }

  @Delete('unfriend/:id')
  async unfriend(@GetCurrent('id') id, @Param('id') friendId: number) {
    return await this.userService.unfriend(id, friendId);
  }

  @Get('me')
  me(@GetCurrent() user) {
    return user;
  }

  @Get(':username')
  findUser(@GetCurrent('id') id: number, @Param('username') username: string) {
    return this.userService.findOneByUsername(id, username);
  }
}
