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
import { ApiBearerAuth } from '@nestjs/swagger';
import type { Response } from 'express';

import { Roles } from 'src/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CookieGetter } from 'src/common/decorator/cookie-getter-decorator';
import { SigninDto } from './dto/signin.dto';
import { QueryPaginationDto } from 'src/infrastructure/query-pagination.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { RolesDec } from 'src/common/decorator/roles-decorator';
import {
  SwagFailedRes,
  SwagSuccessRes,
} from 'src/common/decorator/swag-res-decorator';
import { UserCreateData } from 'src/infrastructure/document/userCreateData';
import { signInData } from 'src/infrastructure/document/signinData';
import { RegistrDto } from './dto/registir.dto';
import { ConfirmOTPDto } from './dto/confirmOtp.dto';
import { ConfirmOtpData } from 'src/infrastructure/document/confirmOtpData';
import { registrData } from 'src/infrastructure/document/registData';

@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @SwagSuccessRes(
    'create for admin and librarian,',
    HttpStatus.CREATED,
    'function for creating admin and librarian',
    201,
    'en:success, uz:muvaffaqiyatli',
    UserCreateData,
  )
  @SwagFailedRes(
    HttpStatus.CONFLICT,
    '',
    409,
    "en: email already exists. uz: bu emaildan ro'yxatdan o'tilgan",
  )
  @RolesDec(Roles.ADMIN)
  @Post()
  @ApiBearerAuth()
  create(
    @CookieGetter('usertoken') token: string,
    @Body() createUserDto: CreateUserDto,
  ) {
    return this.usersService.create(createUserDto);
  }

  @SwagSuccessRes(
    'registration for reader',
    HttpStatus.OK,
    'function for registr readers',
    200,
    'en: success, uz: muvaffaqiyatli',
    registrData
  )
  @SwagFailedRes(
    HttpStatus.CONFLICT,
    '',
    409,
    "en: email already exists, uz: emil ro'yxatda bor",
  )
  @RolesDec('public')
  @Post('registration')
  regist(@Body() dto: RegistrDto) {
    return this.usersService.register(dto);
  }

  @SwagSuccessRes(
    'confirm otp for reader',
    HttpStatus.OK,
    'function for confirm otp readers',
    200,
    'en:success, uz: muvaffaqiyatli',
    ConfirmOtpData,
  )
  @SwagFailedRes(
    HttpStatus.BAD_REQUEST,
    '',
    400,
    "en: otp incorect or expired, uz: otp noto'g'ri yoki muddati tugagan",
  )
  @RolesDec('public')
  @Post('confirmotp')
  confirmotp(
    @Body() dto: ConfirmOTPDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.usersService.confirmOtp(dto, res);
  }
  @SwagSuccessRes(
    'signin for users',
    HttpStatus.OK,
    'signin for users',
    200,
    'en:success, uz:muvaffaqiyatli',
    signInData,
  )
  @SwagFailedRes(
    HttpStatus.UNAUTHORIZED,
    '',
    400,
    'en: Unauthorized, uz: Ruxsat etilmagan',
  )
  @RolesDec('public')
  @Post('signin')
  signIn(
    @Body() signinDto: SigninDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.usersService.signin(signinDto, res);
  }

  @SwagSuccessRes(
    'newtoken for users',
    HttpStatus.OK,
    'en: Token acquisition feature for users, uz: Foydalanuvchilar uchun token olish funksiyasi ',
    200,
    'en: success, uz: muvaffaqiyatli',
    signInData,
  )
  @SwagFailedRes(
    HttpStatus.UNAUTHORIZED,
    '',
    400,
    'en: Unauthorized, uz: Ruxsat etilmagan',
  )
  @RolesDec(Roles.ADMIN, Roles.LIBRARIAN, Roles.READER)
  @Post('newtoken')
  newToken(@CookieGetter('usertoken') token: string, @Body() dto: SigninDto) {
    return this.usersService.newToken(token);
  }

  @SwagSuccessRes(
    'signout for users',
    HttpStatus.OK,
    'en: Sign-out function for users, uz: foydalanuvchilar uchun hisobdan chiqish funksiyasi',
    200,
    'en: success, uz: muvaffaqiyatli',
  )
  @SwagFailedRes(
    HttpStatus.UNAUTHORIZED,
    '',
    400,
    'en: Unauthorized, uz: Ruxsat etilmagan',
  )
  @RolesDec(Roles.ADMIN, Roles.LIBRARIAN, Roles.READER)
  @Post('signOut')
  @ApiBearerAuth()
  signOut(
    @CookieGetter('usertoken') token: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.usersService.signout(token, res);
  }

  @SwagSuccessRes(
    'get all users with pagination',
    HttpStatus.OK,
    'function for get users with pagination',
    200,
    'en: success, uz: muvaffaqiyatli',
    [UserCreateData],
  )
  @SwagFailedRes()
  @RolesDec(Roles.ADMIN)
  @Get()
  @ApiBearerAuth()
  findAllWithPagnation(
    @CookieGetter('usertoken') token: string,
    @Query() querydto: QueryPaginationDto,
  ) {
    const { limit, page, query, searchFileds } = querydto;
    if (searchFileds == 'role') {
      return {
        statusCode: 400,
        message: {
          en: 'cannot be searched by role',
          uz: 'rol asosida qidirish imkonsiz',
        },
      };
    }
    return this.usersService.findWithPagination(
      searchFileds,
      query,
      limit,
      page,
    );
  }

  @SwagSuccessRes(
    'get all users',
    HttpStatus.OK,
    'function for get all users',
    200,
    'en: success, uz: muvaffaqiyatli',
    [UserCreateData],
  )
  @SwagFailedRes()
  @RolesDec(Roles.ADMIN)
  @Get('all')
  @ApiBearerAuth()
  findAll(@CookieGetter('usertoken') token: string) {
    return this.usersService.findAll({
      relations: { borrows: true, book_history: true },
    });
  }

  @SwagSuccessRes(
    'get users by id',
    HttpStatus.OK,
    'function for get users by id',
    200,
    'en: success, uz: muvaffaqiyatli',
    UserCreateData,
  )
  @SwagFailedRes(
    HttpStatus.NOT_FOUND,
    '',
    404,
    'en: user not found, uz: foydalanuvchi topilmadi',
  )
  @RolesDec(Roles.ADMIN, Roles.LIBRARIAN, 'ID')
  @Get(':id')
  @ApiBearerAuth()
  findOne(@CookieGetter('usertoken') token: string, @Param('id') id: string) {
    return this.usersService.findOneById(id, {
      relations: { borrows: true, book_history: true },
    });
  }

  @SwagSuccessRes(
    'update users',
    HttpStatus.OK,
    'function for update users',
    200,
    'en: success, uz: muvaffaqiyatli',
    UserCreateData,
  )
  @SwagFailedRes(
    HttpStatus.CONFLICT,
    '',
    409,
    "en: email already exists, uz: email ro'yxatga olingan",
  )
  @RolesDec(Roles.ADMIN, 'ID')
  @Patch(':id')
  @ApiBearerAuth()
  update(
    @CookieGetter('usertoken') token: string,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @SwagSuccessRes(
    'delete users',
    HttpStatus.OK,
    'function for deleting users',
    200,
  )
  @SwagFailedRes(
    HttpStatus.NOT_FOUND,
    '',
    404,
    'en: user not found, uz: foydalanuvchi topilmadi',
  )
  @RolesDec(Roles.ADMIN)
  @Delete(':id')
  @ApiBearerAuth()
  remove(@CookieGetter('usertoken') token: string, @Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
