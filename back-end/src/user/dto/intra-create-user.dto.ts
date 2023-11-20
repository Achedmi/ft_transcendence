import { IsString } from 'class-validator';

export class IntraCreateUserDto {
  @IsString()
  avatar: string;
  @IsString()
  intraId: string;
}
