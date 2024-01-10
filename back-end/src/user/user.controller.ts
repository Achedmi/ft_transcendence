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
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetCurrent } from 'src/auth/decorator/current.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { TFAGuard } from 'src/auth/guards/TFAGuard.guard';
import { BlockeDto } from 'src/chat/dto/block.dto';

@Controller('user')
@UseGuards(TFAGuard)
// @UseGuards(UserATGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('isAbleToPlay')
  isAbleToPlay(@GetCurrent('id') id: number) {
    return this.userService.isAbleToPlay(id);
  }

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
  @Get('games/:username')
  getGames(@Param('username') username: string) {
    return this.userService.getGames(username);
  }

  @Get('games/winsAndLosses/:username')
  getWinsAndLosses(@Param('username') username: string) {
    return this.userService.getWinsAndLosses(username);
  }

  @Post('addFriend/:friendId')
  async addFriend(@GetCurrent('id') id: number, @Param('friendId', new ParseIntPipe({ optional: false })) friendId: number) {
    return await this.userService.addFriend(id, friendId);
  }

  @Get('friendsOf/:username')
  async friendsOf(@GetCurrent('id') id: number, @Param('username') username: string) {
    return await this.userService.getUserFriendsByUsername(id, username);
  }

  @Delete('unfriend/:id')
  async unfriend(@GetCurrent('id') id, @Param('id', new ParseIntPipe({ optional: false })) friendId: number) {
    return await this.userService.unfriend(id, friendId);
  }

  @Get('me')
  async me(@GetCurrent() user) {
    const { wins, losses } = await this.userService.getWinsAndLosses(user.username);
    user['wins'] = wins;
    user['losses'] = losses;
    const { TFAsecret, ...rest } = user;
    return rest;
  }

  @Get(':username')
  findUser(@GetCurrent('id') id: number, @Param('username') username: string) {
    return this.userService.findOneByUsername(id, username);
  }

  @Post('setMeOnline')
  setMeOnline(@GetCurrent('id') id: number) {
    return this.userService.setMeOnline(id);
  }

  @Post('block')
  block(@GetCurrent('id') me: number, @Body() blockDto: BlockeDto) {
    return this.userService.block(me, blockDto);
  }

  @Post('unblock')
  unblock(@GetCurrent('id') me: number, @Body() blockDto: BlockeDto) {
    return this.userService.unblock(me, blockDto);
  }
}
