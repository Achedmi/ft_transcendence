import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddAdmindDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  chatId: number;
}
