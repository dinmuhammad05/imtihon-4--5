import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { BookHistoryService } from './book-history.service';
import { CreateBookHistoryDto } from './dto/create-book-history.dto';
import { UpdateBookHistoryDto } from './dto/update-book-history.dto';
import { RolesDec } from 'src/common/decorator/roles-decorator';
import { Roles } from 'src/common';
import {
  SwagFailedRes,
  SwagSuccessRes,
} from 'src/common/decorator/swag-res-decorator';

@Controller('book-history')
export class BookHistoryController {
  constructor(private readonly bookHistoryService: BookHistoryService) {}

  @SwagSuccessRes(
    'function for creating book-history',
    HttpStatus.CREATED,
    'bu transaction bilan borrow orqali yaratiladi har ehtimolga qarshi yartildi',
  )
  @SwagFailedRes()
  @RolesDec(Roles.ADMIN, Roles.LIBRARIAN)
  @Post()
  create(@Body() createBookHistoryDto: CreateBookHistoryDto) {
    return this.bookHistoryService.create(createBookHistoryDto);
  }

  @SwagSuccessRes('function for get book history')
  @SwagFailedRes()
  @RolesDec(Roles.ADMIN, Roles.LIBRARIAN)
  @Get()
  findAll() {
    return this.bookHistoryService.findAll();
  }

  @SwagSuccessRes('function for get book history by id')
  @SwagFailedRes()
  @RolesDec(Roles.ADMIN, Roles.LIBRARIAN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookHistoryService.findOneById(id);
  }

  @SwagSuccessRes('function for updating book history')
  @SwagFailedRes()
  @RolesDec(Roles.ADMIN, Roles.LIBRARIAN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBookHistoryDto: UpdateBookHistoryDto,
  ) {
    return this.bookHistoryService.update(id, updateBookHistoryDto);
  }

  @SwagSuccessRes('function for deleting books')
  @SwagFailedRes()
  @RolesDec(Roles.ADMIN, Roles.LIBRARIAN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookHistoryService.remove(id);
  }
}
