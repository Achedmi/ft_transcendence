import { IsString } from 'class-validator';

export class DefaultSignUpDto {
  @IsString()
  username: string;
  @IsString()
  password: string;
  @IsString()
  avatar: string;
}
