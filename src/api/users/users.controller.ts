import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CookieGetter } from 'src/common/decorator/cookie-getter-decorator';
import type { Response } from 'express';
import { SigninDto } from './dto/signin.dto';
import { QueryPaginationDto } from 'src/infrastructure/query-pagination.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { RolesDec } from 'src/common/decorator/roles-decorator';
import { Roles } from 'src/common';
import {
  SwagFailedRes,
  SwagSuccessRes,
} from 'src/common/decorator/swag-res-decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @SwagSuccessRes('create for admin and librarian,', HttpStatus.CREATED)
  @SwagFailedRes()
  @RolesDec(Roles.ADMIN)
  @Post()
  @ApiBearerAuth()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @SwagSuccessRes('signin for users')
  @SwagFailedRes()
  @RolesDec('public')
  @Post('signin')
  @ApiBearerAuth()
  signIn(
    @Body() signinDto: SigninDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.usersService.signin(signinDto, res);
  }

  @SwagSuccessRes('newtoken for users')
  @SwagFailedRes()
  @RolesDec('public')
  @Post('newtoken')
  newToken(@CookieGetter('usertoken') token: string) {
    return this.usersService.newToken(token);
  }

  @SwagSuccessRes('signout for users')
  @SwagFailedRes()
  @RolesDec('public')
  @Post('signOut')
  @ApiBearerAuth()
  signOut(
    @CookieGetter('usertoken') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.usersService.signout(token, res);
  }

  @SwagSuccessRes('get all users with pagination')
  @SwagFailedRes()
  @RolesDec(Roles.ADMIN)
  @Get()
  @ApiBearerAuth()
  findAllWithPagnation(@Query() querydto: QueryPaginationDto) {
    const { limit, page, query, searchFileds } = querydto;
    return this.usersService.findWithPagination(
      searchFileds,
      query,
      limit,
      page,
    );
  }

  @SwagSuccessRes('get all users')
  @SwagFailedRes()
  @RolesDec(Roles.ADMIN)
  @Get('all')
  @ApiBearerAuth()
  findAll() {
    return this.usersService.findAll({
      relations: { borrows: true, book_history: true },
    });
  }

  @SwagSuccessRes('get users by id')
  @SwagFailedRes()
  @RolesDec(Roles.ADMIN, Roles.LIBRARIAN, 'ID')
  @Get(':id')
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @SwagSuccessRes('update users')
  @SwagFailedRes()
  @RolesDec(Roles.ADMIN)
  @Patch(':id')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @SwagSuccessRes('delete users')
  @SwagFailedRes()
  @RolesDec(Roles.ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
