import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChanneltDto } from './dto/create-channel.dto';
import { TFAGuard } from 'src/auth/guards/TFAGuard.guard';
import { GetCurrent } from 'src/auth/decorator/current.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateChatDto } from './dto/update-chat.dto';
import { GiveOwnershipDto } from './dto/giveOwnership.dto';
import { AddAdmindDto } from 'src/chat/dto/addAdmin.dto';
import { RemoveAdminDto } from './dto/removeAdmin.dto';
import { AddMemberDto } from './dto/addMember.dto';
import { KickMemberDto } from './dto/kickMember.dto';

@Controller('chat')
@UseGuards(TFAGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('addAdmin')
  async addAdmin(@GetCurrent('id') me, @Body() addAdminDto: AddAdmindDto) {
    return await this.chatService.addAdmin(me, addAdminDto);
  }

  @Post('removeAdmin')
  async removeAdmin(@GetCurrent('id') me, @Body() remvoeAdminDto: RemoveAdminDto) {
    return await this.chatService.removeAdmin(me, remvoeAdminDto);
  }

  @Post('addMember')
  async addMember(@GetCurrent('id') me, @Body() addMemberDto: AddMemberDto) {
    return await this.chatService.addMember(me, addMemberDto);
  }

  @Post('kickMember')
  async kickMember(@GetCurrent('id') me, @Body() kickMemberDto: KickMemberDto) {
    return await this.chatService.kickMember(me, kickMemberDto);
  }

  @UseInterceptors(FileInterceptor('image'))
  @Post('create')
  create(
    @Body() createChatDto: CreateChanneltDto,
    @GetCurrent('id') userId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }), new MaxFileSizeValidator({ maxSize: 24000000 })],
        fileIsRequired: true,
      }),
    )
    image,
  ) {
    return this.chatService.createChannel(userId, createChatDto, image);
  }

  @Get('getDm')
  getDm(@Query('from') from: number, @Query('to') to: number) {
    return this.chatService.findDm(from, to);
  }

  @Get()
  findAll() {
    return this.chatService.findAll();
  }

  @Post('giveOwnership')
  giveOwnership(@GetCurrent('id') me: number, @Body() giveOwnershipDto: GiveOwnershipDto) {
    return this.chatService.giveOwnership(me, giveOwnershipDto);
  }

  @Get(':id')
  findOne(@GetCurrent('id') me: number, @Param('id') id: string) {
    return this.chatService.GetChatById(me, +id);
  }

  @UseInterceptors(FileInterceptor('image'))
  @Patch('/:id')
  update(
    @GetCurrent('id') me: number,
    @Param('id') id: number,
    @Body() updateChatDto: UpdateChatDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }), new MaxFileSizeValidator({ maxSize: 24000000 })],
        fileIsRequired: false,
      }),
    )
    image,
  ) {
    return this.chatService.updateChannel(me, id, updateChatDto, image);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(+id);
  }
}
