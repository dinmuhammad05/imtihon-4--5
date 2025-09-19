import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryPaginationDto } from 'src/infrastructure/query-pagination.dto';
import { RolesDec } from 'src/common/decorator/roles-decorator';
import { Roles } from 'src/common';
import {
  SwagFailedRes,
  SwagSuccessRes,
} from 'src/common/decorator/swag-res-decorator';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { CookieGetter } from 'src/common/decorator/cookie-getter-decorator';
import { bookCreateData } from 'src/infrastructure/document/bookCreateData';
import { GetBooksData } from 'src/infrastructure/document/getBooksData';

@UseGuards(AuthGuard, RolesGuard)
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @SwagSuccessRes(
    'function for creating books',
    HttpStatus.CREATED,
    'function for creating books',
    201,
    'en:success,uz:muvaffaqiyatli',
    bookCreateData,
  )
  @SwagFailedRes()
  @RolesDec(Roles.ADMIN, Roles.LIBRARIAN)
  @Post()
  @ApiBearerAuth()
  create(
    @CookieGetter('usertoken') token: string,
    @Body() createBookDto: CreateBookDto,
  ) {
    return this.bookService.create(createBookDto);
  }

  @SwagSuccessRes(
    'function for get all books with pagination',
    200,
    'funnction for get book with pagination-filters',
    200,
    'en:success, uz: muvaffaqiyatli',
    [GetBooksData],
  )
  @SwagFailedRes()
  @RolesDec('public')
  @Get()
  findAllWithPagnation(@Query() querydto: QueryPaginationDto) {
    const { limit, page, query } = querydto;
    return this.bookService.findWithPagination(query, limit, page);
  }

  @SwagSuccessRes(
    'function for get all books',
    HttpStatus.OK,
    'function for get all users',
    200,
    'en:success, uz: muvaffaqiyatli',
    [GetBooksData],
  )
  @SwagFailedRes()
  @RolesDec('public')
  @Get('all')
  findAll() {
    return this.bookService.findAll({
      relations: { book_histories: true, borrows: true },
    });
  }

  @SwagSuccessRes(
    'function for get books by id',
    HttpStatus.OK,
    'function for get users by id',
    200,
    'en:success, uz:muvaffaqiyatli',
    GetBooksData,
  )
  @SwagFailedRes(
    HttpStatus.NOT_FOUND,
    '',
    404,
    'ben: book not found, uz: kitob topilmadi',
  )
  @RolesDec('public')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOneById(id, {
      relations: { book_histories: true, borrows: true },
    });
  }

  @SwagSuccessRes(
    'updating books',
    HttpStatus.OK,
    'function for updating books',
    200,
    'en: success, uz: muvaffaqiyatli',
    bookCreateData,
  )
  @SwagFailedRes(
    HttpStatus.NOT_FOUND,
    '',
    404,
    'en: book not found, uz: kitob topilmadi',
  )
  @RolesDec(Roles.ADMIN, Roles.LIBRARIAN)
  @Patch(':id')
  @ApiBearerAuth()
  update(
    @CookieGetter('usertoken') token: string,
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return this.bookService.update(id, updateBookDto);
  }

  @SwagSuccessRes(
    'deleting books',
    HttpStatus.OK,
    'function for delete books',
    200,
    'en: success, uz: muvaffaqiyatli',
  )
  @SwagFailedRes(
    HttpStatus.NOT_FOUND,
    '',
    404,
    'en: book not found, uz: kitob topilmadi',
  )
  @RolesDec(Roles.ADMIN, Roles.LIBRARIAN)
  @Delete(':id')
  @ApiBearerAuth()
  remove(@CookieGetter('usertoken') token: string, @Param('id') id: string) {
    return this.bookService.remove(id);
  }
}
