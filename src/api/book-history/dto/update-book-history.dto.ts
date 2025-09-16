import { PartialType } from '@nestjs/swagger';
import { CreateBookHistoryDto } from './create-book-history.dto';

export class UpdateBookHistoryDto extends PartialType(CreateBookHistoryDto) {}
