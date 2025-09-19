import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { type Cache } from 'cache-manager';
import { Response } from 'express';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BaseService, successRes } from 'src/infrastructure';
import { UserEntity, type UserRepository } from 'src/core';
import { ISuccessRes } from 'src/common';
import { CryptoService } from 'src/infrastructure/crypto';
import { toSkipeTake } from 'src/infrastructure/lib/toSkipeTake';
import { RegistrDto } from './dto/registir.dto';
import { IPayload } from 'src/common/interface/payload';
import { TokenService } from 'src/infrastructure/Token';
import { SigninDto } from './dto/signin.dto';
import { dbConfig } from 'src/config';
import { ConfirmOTPDto } from './dto/confirmOtp.dto';

@Injectable()
export class UsersService extends BaseService<
  CreateUserDto,
  UpdateUserDto,
  UserEntity
> {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepo: UserRepository,
    @Inject(CACHE_MANAGER) private cacheManger: Cache,
    private readonly crypto: CryptoService,
    private readonly tokenService: TokenService,
  ) {
    super(userRepo);
  }
  private generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 xonali
  }

  async create(dto: CreateUserDto): Promise<ISuccessRes> {
    let { password, email } = dto;
    const existEmail = await this.userRepo.findOne({ where: { email } });
    if (existEmail) throw new ConflictException('email already exists');

    dto.password = await this.crypto.encrypt(password);
    return super.create(dto);
  }

  async register(dto: RegistrDto): Promise<ISuccessRes> {
    let { password, email } = dto;
    const existEmail = await this.userRepo.findOne({ where: { email } });
    if (existEmail) throw new ConflictException('email already exists');

    dto.password = await this.crypto.encrypt(password);
    const reader = this.userRepo.create(dto);
    const otp = this.generateOtp();
    await this.cacheManger.set(email, { data: reader, otp: otp });
    return successRes({
      url: 'api/v1/users/confirmotp',
      expired: `${dbConfig.CACHE_TIME/1000/60}-minutes`,
      otp,
    });
  }

  async confirmOtp(dto: ConfirmOTPDto, res: Response) {
    const { email, otp } = dto;

    const value: any = await this.cacheManger.get(email);
    if (!value) throw new BadRequestException('email incorect or otp expired');

    console.log(value, otp);

    if (value.otp != otp) {
      throw new BadRequestException('otp incorect or expired');
    }

    await this.cacheManger.del(email);
    const newReader = await this.userRepo.save(value.data);
    const payload: IPayload = {
      id: newReader.id,
      role: newReader.role,
    };

    const accestoken = await this.tokenService.accessToken(payload);
    const refreshtoken = await this.tokenService.refreshToken(payload);
    await this.tokenService.writeCookie(res, 'usertoken', refreshtoken, 30);

    return successRes({ reader: { newReader }, token: { accestoken } });
  }

  async signin(dto: SigninDto, res: Response) {
    const { email, password } = dto;
    const user = await this.userRepo.findOne({ where: { email } });
    const isMatchedPassword = await this.crypto.decrypt(
      password,
      user?.password ?? '',
    );

    if (!user || !isMatchedPassword)
      throw new BadRequestException('username or pasword incorect');
    const payload: IPayload = {
      id: user.id,
      role: user.role,
    };
    const accestoken = await this.tokenService.accessToken(payload);
    const refreshtoken = await this.tokenService.refreshToken(payload);
    await this.tokenService.writeCookie(res, 'usertoken', refreshtoken, 30);

    return successRes({ token: accestoken });
  }

  async signout(token: string, res: Response) {
    const data: any = await this.tokenService.verifyToken(
      token,
      dbConfig.TOKEN.refresh_token_key,
    );
    if (!data) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const user = await this.userRepo.findOne({ where: { id: data.id } });
    if (!user) throw new ForbiddenException();

    res.clearCookie('usertoken');
    return successRes({});
  }

  async newToken(token: string) {
    const data: any = await this.tokenService.verifyToken(
      token,
      dbConfig.TOKEN.refresh_token_key,
    );
    if (!data) {
      throw new UnauthorizedException('Refresh token expired');
    }
    const user = await this.userRepo.findOne({ where: { id: data?.id } });
    if (!user) {
      throw new ForbiddenException('Forbidden user');
    }
    const paylod: IPayload = {
      id: user.id,
      role: user.role,
    };
    const accessToken = await this.tokenService.accessToken(paylod);
    return successRes({ token: accessToken });
  }

  async findWithPagination(
    searchFileds: string = 'full_name',
    query: string = '',
    limit: number = 10,
    page: number = 1,
  ): Promise<ISuccessRes> {
    const { take, skip } = toSkipeTake(page, limit);

    const [user, count] = await this.userRepo.findAndCount({
      where: {
        [searchFileds]: ILike(`%${query}%`),
      },
      order: {
        created_at: 'DESC',
      },
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

  async updateUser(id: string, dto: UpdateUserDto): Promise<ISuccessRes> {
    let { password, email: emailDto } = dto;
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) throw new NotFoundException('user not found');

    dto.email = user.email;
    if (emailDto) {
      const existEmail = await this.userRepo.findOne({
        where: { email: emailDto },
      });

      if (existEmail && emailDto !== user.email)
        throw new ConflictException('email already exists');

      dto.email = emailDto;
    }

    if (password) {
      dto.password = user.password;
    }

    await this.userRepo.update(id, dto);
    const upUser = await this.userRepo.findOne({ where: { id } });

    return successRes(upUser || {});
  }
}
