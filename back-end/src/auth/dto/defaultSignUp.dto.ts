import { IsString } from 'class-validator';

export class DefaultSignUpDto {
  @IsString()
  username: string;
  @IsString()
  avatar: string;
}
