import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class sendMessageDto {
  @IsNumber()
  @IsNotEmpty()
  chatId: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}
