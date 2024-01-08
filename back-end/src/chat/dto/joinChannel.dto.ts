import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { AddMemberDto } from './addMember.dto';

export class joinChannel {
  @IsNumber()
  @IsNotEmpty()
  channelId: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password?: string;
}
