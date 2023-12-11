import { IsNumber } from 'class-validator';

export class AddFriendDto {
  @IsNumber()
  friendId: number;
}
