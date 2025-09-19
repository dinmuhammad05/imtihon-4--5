import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';
import { BaseService, successRes } from 'src/infrastructure';
import {
  BookEntity,
  type BookHisRepository,
  BookHistoryEntity,
  type BookRepository,
  BorrowEntity,
  type BorrowRepository,
  UserEntity,
  type UserRepository,
} from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { ISuccessRes, Roles } from 'src/common';
import { toSkipeTake } from 'src/infrastructure/lib/toSkipeTake';
import { Any, DataSource, FindOneOptions, ILike } from 'typeorm';
import { IPayload } from 'src/common/interface/payload';

@Injectable()
export class BorrowService extends BaseService<
  CreateBorrowDto,
  UpdateBorrowDto,
  BorrowEntity
> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: UserRepository,
    @InjectRepository(BorrowEntity)
    private readonly borrowRepo: BorrowRepository,
    @InjectRepository(BookEntity) private readonly bookRepo: BookRepository,
    @InjectRepository(BookHistoryEntity)
    private readonly hisoryRepo: BookHisRepository,
    private datasource: DataSource,
  ) {
    super(borrowRepo);
  }

  async createBorrow(dto: CreateBorrowDto, user: IPayload) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { bookId, userId } = dto;
      console.log(user.role !== Roles.ADMIN);

      if (user.role !== Roles.ADMIN)
        throw new ForbiddenException(
          'en:forbidden user, uz:taqiqlangan foydalanuvchi',
        );
      const existsUser = await queryRunner.manager.findOneBy(UserEntity, {
        id: userId,
      });

      if (!existsUser) throw new NotFoundException('user not found');

      const [bookUser, count] = await this.borrowRepo.findAndCount({
        where: { userId, overdue: false },
      });

      if (count >= 3)
        throw new BadRequestException(
          'en:there are more than 3 books on the user, uz: foydalanuvchida 3 tadan ortiq kitob mavjud',
        );

      const book = await queryRunner.manager.findOneBy(BookEntity, {
        id: bookId,
      });

      if (!book) throw new NotFoundException('book not found');
      console.log(count, '55');

      if (!book.available)
        throw new BadRequestException(
          `${book.title}, en:unavailable, uz: mavjud emas`,
        );

      const bookHis = queryRunner.manager.create(BookHistoryEntity, {
        bookId,
        userId,
      });
      const newHistBook = await queryRunner.manager.save(
        BookHistoryEntity,
        bookHis,
      );
      const borrow = queryRunner.manager.create(BorrowEntity, dto);
      const newBorrow = await queryRunner.manager.save(BorrowEntity, borrow);

      return successRes({ newBorrow, bookHistory: newHistBook }, 201);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findone(
    id: string,
    user: IPayload,
    options?: FindOneOptions<BorrowEntity> | undefined,
  ): Promise<ISuccessRes> {
    const borrow = await this.borrowRepo.findOne({ where: { id } });
    if (!borrow) {
      throw new NotFoundException();
    }

    return this.findOneById(id, options);
  }

  async findWithPagination(
    searchFileds: string = 'userId',
    query: string = '',
    limit: number = 10,
    page: number = 1,
  ): Promise<ISuccessRes> {
    const { take, skip } = toSkipeTake(page, limit);

    const [user, count] = await this.borrowRepo.findAndCount({
      where: {
        [searchFileds]: ILike(`%${query}%`),
      },
      order: {
        created_at: 'DESC',
      },
      relations: { user: true, book: true },
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

  async topUser() {
    const readers = await this.userRepo.find({ where: { role: Roles.READER } });
    const data = new Map();
    for (let i = 0; i < readers.length; i++) {
      const [user, count] = await this.borrowRepo.findAndCount({
        where: { userId: readers[i].id },
      });
      if (user && count !== 0) data.set(readers[i].id, count);
    }

    if (data.size == 0) {
      return successRes({});
    }
    const maxCount: number[] = [];
    let len = 5 < data.size ? 5 : data.size;
    for (let i = 0; i < len; i++) {
      const max = Math.max(...data.values());
      maxCount.push(max);
    }

    const res: { key: string; value: number }[] = [];
    for (let [key, value] of data) {
      if (maxCount.includes(value)) {
        res.push({ key, value });
      }
    }
    len = 5 < res.length ? 5 : data.size;
    const result: { user: object; count: number }[] = [];
    for (let p = 0; p < len; p++) {
      const { key, value } = res[p];
      const user: any = await this.userRepo.findOne({ where: { id: key } });
      result.push({ user, count: value });
    }

    return successRes({ result });
  }

  async topbooks() {
    const books = await this.bookRepo.find();
    const data = new Map();
    for (let i = 0; i < books.length; i++) {
      const [book, count] = await this.borrowRepo.findAndCount({
        where: { bookId: books[i].id },
      });
      if (book && count !== 0) data.set(books[i].id, count);
    }

    if (data.size == 0) {
      return successRes({});
    }

    const maxCount: number[] = [];
    let len = 5 < data.size ? 5 : data.size;
    for (let i = 0; i < len; i++) {
      const max = Math.max(...data.values());
      maxCount.push(max);
    }

    const res: { key: string; value: number }[] = [];
    for (let [key, value] of data) {
      if (maxCount.includes(value)) {
        res.push({ key, value });
      }
    }
    len = 5 < res.length ? 5 : data.size;
    const result: { user: object; count: number }[] = [];
    for (let p = 0; p < len; p++) {
      const { key, value } = res[p];
      const user: any = await this.bookRepo.findOne({ where: { id: key } });
      result.push({ user, count: value });
    }

    return successRes({ result });
  }
}
