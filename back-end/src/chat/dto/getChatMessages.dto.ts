import { IsNotEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class GetChatMessagesDto {
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  @IsPositive()
  skip: number;
}
