import { PartialType } from '@nestjs/mapped-types';
import { sendMessageDto } from './create-message.dto';

export class UpdateMessageDto extends PartialType(sendMessageDto) {}
