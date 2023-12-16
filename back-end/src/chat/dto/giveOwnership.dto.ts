import { IsNotEmpty, IsNumber } from 'class-validator';

export class GiveOwnershipDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;
  @IsNumber()
  @IsNotEmpty()
  chatId: number;
}
