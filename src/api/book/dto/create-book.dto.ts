import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    type: 'string',
    description: 'book title',
    example: 'Baxtiyor oila',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    type: 'string',
    description: 'author book',
    example: 'Shayx Muhammad Sodiq Muhammad Yusuf',
  })
  @IsString()
  @IsNotEmpty()
  author: string;

  @ApiProperty({
    type: 'number',
    description: 'published year',
    example: '2015',
  })
  @IsNumber()
  @IsOptional()
  published_year: number;

  @ApiProperty({
    type: 'boolean',
    description: 'availble book? default true',
    example: 'true',
  })
  @IsBoolean()
  @IsOptional()
  available: boolean;
}
