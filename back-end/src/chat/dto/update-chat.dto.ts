import { PartialType } from '@nestjs/mapped-types';
import { CreateChanneltDto } from './create-channel.dto';

export class UpdateChatDto extends PartialType(CreateChanneltDto) {}
