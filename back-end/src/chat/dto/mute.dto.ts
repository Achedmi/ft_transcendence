import { IsNotEmpty, IsNumber } from 'class-validator';

export class MuteDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;
  @IsNumber()
  @IsNotEmpty()
  chatId: number;

  @IsNumber()
  @IsNotEmpty()
  time: number;
}
