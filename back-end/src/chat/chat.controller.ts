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
  ValidationPipe,
  ParseIntPipe,
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
import { MuteDto } from './dto/mute.dto';
import { BlockeDto } from './dto/block.dto';
import { GetChatMessagesDto } from './dto/getChatMessages.dto';
import { BanMemberDto } from './dto/banMember.dto';

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

  @Post('banMember')
  async banMember(@GetCurrent('id') me, @Body() banMemberDto: BanMemberDto) {
    return await this.chatService.banMember(me, banMemberDto);
  }

  @Post('unbanMember')
  async unbanMember(@GetCurrent('id') me, @Body() unbanMemberDto: KickMemberDto) {
    return await this.chatService.unbanMember(me, unbanMemberDto);
  }

  @UseInterceptors(FileInterceptor('image'))
  @Post('create')
  create(
    @Body() createChatDto: CreateChanneltDto,
    @GetCurrent('id') userId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }), new MaxFileSizeValidator({ maxSize: 24000000 })],
        fileIsRequired: false,
      }),
    )
    image,
  ) {
    return this.chatService.createChannel(userId, createChatDto, image);
  }

  @Get('getDm')
  getDm(@GetCurrent('id') me: number, @Query('to', new ParseIntPipe()) to: number) {
    return this.chatService.findDm(me, to);
  }

  @Get('getDms')
  getDms(@GetCurrent('id') me: number) {
    return this.chatService.getDms(me);
  }

  @Get('getChannels')
  getChannels(@GetCurrent('id') me: number) {
    return this.chatService.getChannels(me);
  }

  @Get()
  findAll() {
    return this.chatService.findAll();
  }

  @Post('giveOwnership')
  giveOwnership(@GetCurrent('id') me: number, @Body() giveOwnershipDto: GiveOwnershipDto) {
    return this.chatService.giveOwnership(me, giveOwnershipDto);
  }

  @Post('mute')
  mute(@GetCurrent('id') me: number, @Body() muteDto: MuteDto) {
    return this.chatService.mute(me, muteDto);
  }

  @Post('block')
  block(@GetCurrent('id') me: number, @Body() blockDto: BlockeDto) {
    return this.chatService.block(me, blockDto);
  }

  @Post('unblock')
  unblock(@GetCurrent('id') me: number, @Body() blockDto: BlockeDto) {
    return this.chatService.unblock(me, blockDto);
  }

  @Get('getChatMessages/:id')
  getChatMessages(@GetCurrent('id') me: number, @Param('id', new ParseIntPipe({ optional: false })) id: number, @Query() { skip }: GetChatMessagesDto) {
    return this.chatService.getChatMessages(me, id, skip);
  }

  @Get('getChatInfos/:id')
  getChatInfos(@GetCurrent('id') me, @Param('id', new ParseIntPipe({ optional: false })) id: number) {
    return this.chatService.getChatInfos(me, +id);
  }

  @Get(':id')
  findOne(@GetCurrent('id') me: number, @Param('id', new ParseIntPipe({ optional: false })) id: number) {
    return this.chatService.GetChatById(me, id);
  }

  @UseInterceptors(FileInterceptor('image'))
  @Patch('/:id')
  update(
    @GetCurrent('id') me: number,
    @Param('id', new ParseIntPipe({ optional: false })) id: number,
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
  remove(@Param('id', new ParseIntPipe({ optional: false })) id: number) {
    return this.chatService.remove(id);
  }
}
