import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { CreateBorrowDto } from './dto/create-borrow.dto';
import { UpdateBorrowDto } from './dto/update-borrow.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { RolesDec } from 'src/common/decorator/roles-decorator';
import { Roles } from 'src/common';
import {
  SwagFailedRes,
  SwagSuccessRes,
} from 'src/common/decorator/swag-res-decorator';
import { GetRequestUser } from 'src/common/decorator/getj-req-decorator';
import { type IPayload } from 'src/common/interface/payload';
import { ApiBearerAuth } from '@nestjs/swagger';
import { topUserData } from 'src/infrastructure/document/topUserData';
import { CreateBorrowData } from 'src/infrastructure/document/createBorrowData';
import { topBooksData } from 'src/infrastructure/document/topBooksData';
import { GetBorrowData } from 'src/infrastructure/document/getBorrowData';
import { getBorrowByIdData } from 'src/infrastructure/document/getBorrowByIdData';

@UseGuards(AuthGuard, RolesGuard)
@Controller('borrow')
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @SwagSuccessRes(
    'create borrow reader',
    HttpStatus.CREATED,
    'function for create borrow',
    201,
    'en: success, uz: muvaffaqiyatli',
    CreateBorrowData,
  )
  @SwagFailedRes(
    HttpStatus.BAD_REQUEST,
    '',
    400,
    'en:forbidden user, uz:taqiqlangan foydalanuvchi',
  )
  @RolesDec(Roles.ADMIN, Roles.LIBRARIAN, Roles.READER)
  @Post()
  @ApiBearerAuth()
  create(
    @Body() createBorrowDto: CreateBorrowDto,
    @GetRequestUser('user') user: IPayload,
  ) {
    return this.borrowService.createBorrow(createBorrowDto, user);
  }

  @SwagSuccessRes(
    'top users',
    HttpStatus.OK,
    "en:Function to get users who have borrowed the most, uz:eng ko'p qarz olgan foydalanuvchilarni olish funksiyasi",
    200,
    'en:success, uz:muvaffaqiyatli',
    topUserData,
  )
  @SwagFailedRes()
  @RolesDec('public')
  @Get('topuser')
  topusers() {
    return this.borrowService.topUser();
  }

  @SwagSuccessRes(
    'top books',
    HttpStatus.OK,
    'function for get top books',
    200,
    'en:success, uz: muvaffaqiyatli',
    topBooksData,
  )
  @SwagFailedRes()
  @RolesDec('public')
  @Get('/top/books')
  topbooks() {
    return this.borrowService.topbooks();
  }

  @SwagSuccessRes(
    'all borrow',
    HttpStatus.OK,
    'function for get all borrows',
    200,
    'en:success, uz: muvaffaqiyatli',
    GetBorrowData,
  )
  @SwagFailedRes()
  @RolesDec(Roles.ADMIN, Roles.LIBRARIAN, Roles.LIBRARIAN)
  @Get('all')
  @ApiBearerAuth()
  findAll() {
    return this.borrowService.findAll({
      relations: { book: true, user: true },
    });
  }

  @SwagSuccessRes(
    'get  borrow by Id ',
    HttpStatus.OK,
    'function for get borrow by id',
    200,
    'en:success, uz:muvaffaqiyatli',
    getBorrowByIdData,
  )
  @SwagFailedRes(
    HttpStatus.NOT_FOUND,
    '',
    404,
    'en: borrow not found, uz: qarz mavjud emas',
  )
  @RolesDec(Roles.ADMIN, Roles.LIBRARIAN, Roles.READER)
  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id') id: string, @GetRequestUser('user') user: IPayload) {
    return this.borrowService.findone(id, user, {
      relations: { book: true, user: true },
    });
  }

  @SwagSuccessRes(
    'update borrow ',
    HttpStatus.OK,
    'function for get borrow by id',
    200,
    'en: succcess, uz: muvaffaqiyatli',
    getBorrowByIdData,
  )
  @SwagFailedRes(
    HttpStatus.NOT_FOUND,
    '',
    404,
    'en: borrow not found, uz: qarz mavjud emas',
  )
  @RolesDec(Roles.ADMIN, Roles.LIBRARIAN)
  @Patch(':id')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateBorrowDto: UpdateBorrowDto) {
    return this.borrowService.update(id, updateBorrowDto);
  }

  @SwagSuccessRes(
    'deleting borrow ',
    HttpStatus.OK,
    'function for deleting borrow',
    200,
    'en: succcess, uz: muvaffaqiyatli',
  )
  @SwagFailedRes(
    HttpStatus.NOT_FOUND,
    '',
    404,
    'en: borrow not found, uz: qarz mavjud emas',
  )
  @RolesDec(Roles.ADMIN, Roles.LIBRARIAN)
  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.borrowService.remove(id);
  }
}
