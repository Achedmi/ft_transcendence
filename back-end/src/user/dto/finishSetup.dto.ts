import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class FinishSetupUserDto {
  @IsString()
  @MaxLength(12)
  @MinLength(2)
  displayName: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  @MaxLength(68)
  bio?: string;
}
