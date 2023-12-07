import { PartialType } from '@nestjs/mapped-types';
import { CreateChatDto } from '../../chat/dto/create-chat.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SendDmDto {
  @IsNumber()
  @IsNotEmpty()
  to: number;

  @IsString()
  @IsNotEmpty()
  message: string;
}
