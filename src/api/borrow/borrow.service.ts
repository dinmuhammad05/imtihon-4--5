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
} from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { ISuccessRes, Roles } from 'src/common';
import { toSkipeTake } from 'src/infrastructure/lib/toSkipeTake';
import { DataSource, FindOneOptions, ILike } from 'typeorm';
import { IPayload } from 'src/common/interface/payload';

@Injectable()
export class BorrowService extends BaseService<
  CreateBorrowDto,
  UpdateBorrowDto,
  BorrowEntity
> {
  constructor(
    @InjectRepository(BorrowEntity)
    private readonly borrowRepo: BorrowRepository,
    @InjectRepository(BookEntity) private readonly bookRepo: BookRepository,
    @InjectRepository(BookHistoryEntity)
    private readonly hisoryRepo: BookHisRepository,
    private datasource: DataSource,
  ) {
    super(borrowRepo);
  }

  async createBorrow(dto: CreateBorrowDto) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { bookId, userId } = dto;
      const existsUser = await queryRunner.manager.findOneBy(UserEntity, {
        id: userId,
      });
      console.log('kkk');

      if (!existsUser) throw new NotFoundException('user not found');

      const countBorrowUser = await queryRunner.manager.findBy(BorrowEntity, {
        userId,
      });
      if (countBorrowUser.length > 3)
        throw new BadRequestException('must be max count borrow user 3');

      const book = await queryRunner.manager.findOneBy(BookEntity, {
        id: bookId,
      });

      if (!book) throw new NotFoundException('book not found');

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
    if (user.role !== Roles.ADMIN || Roles.LIBRARIAN) {
      if (borrow && borrow.userId !== user.id)
        throw new ForbiddenException('siz kora olmaysiz');
    }

    return this.findOneById(id,options);
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
}
