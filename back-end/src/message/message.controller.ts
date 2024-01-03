import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { MessageService } from './message.service';
import { SendMessageDto } from './dto/create-message.dto';
import { TFAGuard } from 'src/auth/guards/TFAGuard.guard';
import { GetCurrent } from 'src/auth/decorator/current.decorator';
import { SendDmDto } from './dto/send-dm.dto';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(TFAGuard)
  @Post('sendMessage')
  create(@Body() createMessageDto: SendMessageDto, @GetCurrent('id') userId: number) {
    return this.messageService.sendMessage(userId, createMessageDto);
  }

  @UseGuards(TFAGuard)
  @Post('sendDm')
  sendDm(@Body() sendDmDto: SendDmDto, @GetCurrent('id') userId: number) {
    return this.messageService.sendDm(userId, sendDmDto);
  }

  @Get()
  findAll() {
    return this.messageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseIntPipe({ optional: false })) id: number) {
    return this.messageService.findOne(id);
  }
}
