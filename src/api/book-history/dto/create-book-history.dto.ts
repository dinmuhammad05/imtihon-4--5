import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Action } from 'src/core';

export class CreateBookHistoryDto {
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
    description: 'user id',
    example: 'asdfhaj87dsfddfa',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    type: 'string',
    description: 'action borrow or return',
    example: 'borrow',
  })
  @IsEnum(Action)
  @IsOptional()
  action?: Action;

  @ApiProperty({
    type: 'string',
    description: 'book history date, default date now',
    example: '2025-09-16T17:15:00.000Z',
  })
  @IsDateString()
  @IsOptional()
  date: Date;
}
