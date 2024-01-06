import { ChatType, Visibility } from '@prisma/client';
import { ArrayMinSize, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateChanneltDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(12)
  name: string;

  @IsEnum(Visibility)
  visibility: Visibility;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  password?: string;
}
