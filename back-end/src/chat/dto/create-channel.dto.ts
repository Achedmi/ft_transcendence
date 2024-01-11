import { ChatType, Visibility } from '@prisma/client';
import { ArrayMinSize, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateChanneltDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(12)
  @MinLength(3)
  name: string;

  @IsEnum(Visibility)
  visibility: Visibility;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  password?: string;
}
