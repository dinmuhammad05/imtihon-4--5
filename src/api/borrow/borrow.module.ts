import { Module } from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { BorrowController } from './borrow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity, BookHistoryEntity, BorrowEntity, UserEntity } from 'src/core';

@Module({
  imports:[TypeOrmModule.forFeature([BorrowEntity, BookEntity, BookHistoryEntity, UserEntity])],
  controllers: [BorrowController],
  providers: [BorrowService],
})
export class BorrowModule {}
