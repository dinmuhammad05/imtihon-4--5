import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  UseGuards,
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
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(AuthGuard, RolesGuard)
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
  @ApiBearerAuth()
  create(@Body() createBookHistoryDto: CreateBookHistoryDto) {
    return this.bookHistoryService.create(createBookHistoryDto);
  }

  @SwagSuccessRes('function for get book history')
  @SwagFailedRes()
  @RolesDec(Roles.ADMIN, Roles.LIBRARIAN)
  @Get()
  @ApiBearerAuth()
  findAll() {
    return this.bookHistoryService.findAll({relations:{book:true, user:true}});
  }

  @SwagSuccessRes('function for get book history by id')
  @SwagFailedRes()
  @RolesDec(Roles.ADMIN, Roles.LIBRARIAN)
  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.bookHistoryService.findOneById(id, {relations:{book:true, user:true}});
  }

  @SwagSuccessRes('function for updating book history')
  @SwagFailedRes()
  @RolesDec(Roles.ADMIN, Roles.LIBRARIAN)
  @Patch(':id')
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.bookHistoryService.remove(id);
  }
}
