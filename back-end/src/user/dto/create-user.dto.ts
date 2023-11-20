import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username?: string;
  @IsString()
  password?: string;
  @IsString()
  avatar: string;
  @IsString()
  intraId: string;
}
