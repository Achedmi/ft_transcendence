import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SendDmDto {
  @IsNumber()
  @IsNotEmpty()
  to: number;

  @IsString()
  @IsNotEmpty()
  message: string;
}
