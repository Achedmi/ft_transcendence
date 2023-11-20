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
import { UserATGuard } from 'src/auth/guards/userATGuard.guard';
import { GetCurrent } from 'src/auth/decorator/current.decorator';
import { HelpersService } from 'src/helpers/helpers.service';
import { Response } from 'express';
import { User } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.userService.findOne(+id);
  // }

  // @UseGuards(UserATGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Patch()
  async update(
    // @GetCurrent('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 19385 }),
        ],
        fileIsRequired: false,
      }),
    )
    image,
  ) {
    console.log(updateUserDto?.username);
    console.log(image);
    await this.userService.update(image);
    return { message: 'user updated' };

    // return await this.userService.update(id, updateUserDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.remove(+id);
  // }

  // @Get('me')
  // @UseGuards(UserATGuard)
  // async me(@GetCurrent() user: User) {
  //   return user;
  // }
}
