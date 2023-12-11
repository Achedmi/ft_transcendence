import { IsEnum, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class SearchDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  search: string;
  @IsString()
  @IsOptional()
  @IsEnum(['users', 'chat'])
  type?: string;
}
