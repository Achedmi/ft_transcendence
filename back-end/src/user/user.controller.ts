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
import { FileInterceptor } from '@nestjs/platform-express';
import { TFAGuard } from 'src/auth/guards/TFAGuard.guard';

@Controller('user')
@UseGuards(TFAGuard)
@UseGuards(UserATGuard)
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
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 24000000 }),
        ],
        fileIsRequired: false,
      }),
    )
    image,
  ) {
    await this.userService.update(image, id, updateUserDto);
    return { message: 'user updated' };
  }

  @Get('me')
  me(@GetCurrent() user) {
    return user;
  }
}
