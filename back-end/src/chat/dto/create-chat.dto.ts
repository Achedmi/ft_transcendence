import { ChatType, Visibility } from '@prisma/client';
import {
  ArrayMinSize,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateChatDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  name?: string;

  @IsEnum(ChatType)
  type: ChatType;

  @IsEnum(Visibility)
  visibility: Visibility;

  @IsNotEmpty()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  members: number[];
}

//if it was protected, i need to ass a pass key
