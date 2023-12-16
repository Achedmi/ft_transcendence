import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddMemberDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;
  @IsNumber()
  @IsNotEmpty()
  chatId: number;
}
