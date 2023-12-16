import { ChatType, Visibility } from '@prisma/client';
import { ArrayMinSize, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateChanneltDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Visibility)
  visibility: Visibility;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  password?: string;
}
