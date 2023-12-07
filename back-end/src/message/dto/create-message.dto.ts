import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SendMessageDto {
  @IsNumber()
  @IsNotEmpty()
  chatId: number;

  @IsString()
  @IsNotEmpty()
  message: string;
}
