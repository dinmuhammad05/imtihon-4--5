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
} from '@nestjs/common';
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

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @SwagSuccessRes('function for creating books', HttpStatus.CREATED)
  @SwagFailedRes()
  @RolesDec(Roles.ADMIN, Roles.LIBRARIAN)
  @Post()
  create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @SwagSuccessRes('function for get all books with pagination')
  @SwagFailedRes()
  @RolesDec('public')
  @Get()
  findAllWithPagnation(@Query() querydto: QueryPaginationDto) {
    const { limit, page, query } = querydto;
    return this.bookService.findWithPagination(query, limit, page);
  }

  @SwagSuccessRes('function for get all books')
  @SwagFailedRes()
  @RolesDec('public')
  @Get('all')
  findAll() {
    return this.bookService.findAll();
  }

  @SwagSuccessRes('function for get books by id')
  @SwagFailedRes()
  @RolesDec()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookService.findOneById(id);
  }

  @SwagSuccessRes('function for updating books')
  @SwagFailedRes()
  @RolesDec(Roles.ADMIN, Roles.LIBRARIAN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(id, updateBookDto);
  }

  @SwagSuccessRes('function for delete books')
  @SwagFailedRes()
  @RolesDec(Roles.ADMIN, Roles.LIBRARIAN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookService.remove(id);
  }
}
