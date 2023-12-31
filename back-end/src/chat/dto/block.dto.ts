import { IsNotEmpty, IsNumber } from 'class-validator';

export class BlockeDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
