import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BaseService, successRes } from 'src/infrastructure';
import { BookEntity, type BookRepository } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { ISuccessRes } from 'src/common';
import { toSkipeTake } from 'src/infrastructure/lib/toSkipeTake';
import { ILike } from 'typeorm';

@Injectable()
export class BookService extends BaseService<
  CreateBookDto,
  UpdateBookDto,
  BookEntity
> {
  constructor(
    @InjectRepository(BookEntity) private readonly bookRepo: BookRepository,
  ) {
    super(bookRepo);
  }

  async findWithPagination(
    query: string = '',
    limit: number = 10,
    page: number = 1,
  ): Promise<ISuccessRes> {
    const { take, skip } = toSkipeTake(page, limit);

    const [user, count] = await this.bookRepo.findAndCount({
      where: {
        title: ILike(`%${query}%`),
      },
      order: {
        created_at: 'DESC',
      },
      take,
      skip,
    });
    const total_page = Math.ceil(count / limit);
    return successRes({
      data: user,
      meta: {
        page,
        total_page,
        total_count: count,
        hasNextPage: total_page > page,
      },
    });
  }
}
