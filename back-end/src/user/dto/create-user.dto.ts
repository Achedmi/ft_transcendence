import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username?: string;
  @IsString()
  avatar: string;
  @IsString()
  intraId: string;
  @IsString()
  @IsOptional()
  bio?: string;
}
