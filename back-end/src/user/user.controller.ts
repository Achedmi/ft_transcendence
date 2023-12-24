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

  @Get('isAbleToPlay')
  isAbleToPlay(@GetCurrent('id') id: number) {
    console.log('isAbleToPlay', id);
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
  async me(@GetCurrent() user) {
    const { wins, losses } = await this.userService.getWinsAndLosses(user.username);
    user['wins'] = wins;
    user['losses'] = losses;
    return user;
  }

  @Get(':username')
  findUser(@GetCurrent('id') id: number, @Param('username') username: string) {
    return this.userService.findOneByUsername(id, username);
  }

  @Post('setMeOnline')
  setMeOnline(@GetCurrent('id') id: number) {
    return this.userService.setMeOnline(id);
  }
}
//
/*
{
    "id": 1,
    "username": "achedmi",
    "displayName": "achedmi",
    "avatar": "http://res.cloudinary.com/dwrysd8sm/image/upload/v1702374192/wp8ylrz4ejczvz8gthwr.png",
    "level": 0,
    "status": "ONLINE",
    "isTFAenabled": false,
    "TFAsecret": "OM3A24TEC5HVYELX",
    "bio": "big fan of sohaib",
    "createdAt": "2023-12-09T10:33:40.668Z"
}*/
/*
{
    "id": 1,
    "username": "achedmi",
    "displayName": "achedmi",
    "avatar": "http://res.cloudinary.com/dwrysd8sm/image/upload/v1702374192/wp8ylrz4ejczvz8gthwr.png",
    "level": 0,
    "status": "ONLINE",
    "isTFAenabled": false,
    "TFAsecret": "OM3A24TEC5HVYELX",
    "bio": "big fan of sohaib",
    "createdAt": "2023-12-09T10:33:40.668Z",
    "isTFAVerified": false,
    "userAT": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhY2hlZG1pIiwiaXNURkFWZXJpZmllZCI6ZmFsc2UsImlhdCI6MTcwMzMzNjYzNSwiZXhwIjoxNzAzNDIzMDM1fQ.fHIOuEcLTocPIRxovXnW-9xgLAiN7UCKPJcMkae78lQ",
    "userRT": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhY2hlZG1pIiwiaXNURkFWZXJpZmllZCI6ZmFsc2UsImlhdCI6MTcwMzMzNjYzNSwiZXhwIjoxNzAzOTQxNDM1fQ.9rnxUQi9ouE8TmNbWIbQReTsTAZMA6g_YXxZ2O7vZEY"
}*/
