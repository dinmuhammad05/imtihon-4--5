import { Injectable } from '@nestjs/common';
import { CreateBookHistoryDto } from './dto/create-book-history.dto';
import { UpdateBookHistoryDto } from './dto/update-book-history.dto';
import { BaseService } from 'src/infrastructure';
import { type BookHisRepository, BookHistoryEntity } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class BookHistoryService extends BaseService<
  CreateBookHistoryDto,
  UpdateBookHistoryDto,
  BookHistoryEntity
> {
  constructor(
    @InjectRepository(BookHistoryEntity)
    private readonly historyRepo: BookHisRepository,
  ) {
    super(historyRepo);
  }
}
