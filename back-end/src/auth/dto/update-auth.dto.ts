import { PartialType } from '@nestjs/mapped-types';
import { LoginDto } from './loginDto';

export class UpdateAuthDto extends PartialType(LoginDto) {}
