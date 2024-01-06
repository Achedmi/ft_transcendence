import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;
  @IsString()
  avatar: string;
  @IsString()
  @MaxLength(12)
  displayName: string;
}
