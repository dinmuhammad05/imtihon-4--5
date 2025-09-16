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

@UseGuards(AuthGuard, RolesGuard)
@Controller('borrow')
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @SwagSuccessRes('create borrow reader', HttpStatus.CREATED)
  @SwagFailedRes()
  @RolesDec(Roles.ADMIN, Roles.LIBRARIAN, Roles.READER)
  @Post()
  create(@Body() createBorrowDto: CreateBorrowDto) {
    return this.borrowService.createBorrow(createBorrowDto);
  }

  @SwagSuccessRes('get all borrow reader')
  @SwagFailedRes()
  @RolesDec(Roles.ADMIN, Roles.LIBRARIAN, Roles.LIBRARIAN)
  @Get('all')
  findAll() {
    return this.borrowService.findAll();
  }

  @SwagSuccessRes('get  borrow by Id ')
  @SwagFailedRes()
  @RolesDec(Roles.ADMIN, Roles.LIBRARIAN, Roles.READER)
  @Get(':id')
  findOne(@Param('id') id: string, @GetRequestUser('user') user: IPayload) {
    return this.borrowService.findone(id, user, {
      relations: { book: true, user: true },
    });
  }

  @SwagSuccessRes('update borrow ')
  @SwagFailedRes()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBorrowDto: UpdateBorrowDto) {
    return this.borrowService.update(id, updateBorrowDto);
  }

  @SwagSuccessRes('remove borrow ')
  @SwagFailedRes()
  @RolesDec(Roles.ADMIN, Roles.LIBRARIAN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.borrowService.remove(id);
  }
}
