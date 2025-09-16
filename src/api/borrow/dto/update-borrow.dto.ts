import { PartialType } from '@nestjs/swagger';
import { CreateBorrowDto } from './create-borrow.dto';

export class UpdateBorrowDto extends PartialType(CreateBorrowDto) {}
