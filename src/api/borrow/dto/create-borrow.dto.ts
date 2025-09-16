import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateBorrowDto {
  @ApiProperty({
    type: 'string',
    description: 'user id',
    example: 'fdjklahfdasklj3fie944',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    type: 'string',
    description: 'book id',
    example: 'fdjklahfdasklj3fie944',
  })
  @IsUUID()
  @IsNotEmpty()
  bookId: string;

  @ApiProperty({
    type: 'string',
    description: 'borrow date default date now  ',
    example: '16.09.2025',
  })
  @IsDate()
  @IsOptional()
  borrow_date?: Date;

  @ApiProperty({
    type: 'string',
    description: 'due date default date now  ',
    example: '2025-09-16T17:15:00.000Z',
  })
  @Min(1)
  @Max(7)
  @IsNumber()
  @IsNotEmpty()
  due_date: number;

  @ApiProperty({
    type: 'string',
    description: 'return date',
    example: '2025-09-16T17:15:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  return_date: Date;

  @ApiProperty({
    type: 'boolean',
    description: 'overdue default false',
    example: 'false',
  })
  @IsBoolean()
  @IsOptional()
  overdue?: boolean;
}
