import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { CryptoService } from 'src/infrastructure/crypto';
import { TokenService } from 'src/infrastructure/Token';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/core';

@Module({
  imports:[TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [UsersService, CryptoService, TokenService],
})
export class UsersModule {}
