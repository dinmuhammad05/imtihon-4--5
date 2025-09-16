import { Module } from '@nestjs/common';
import { BorrowService } from './borrow.service';
import { BorrowController } from './borrow.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity, BookHistoryEntity, BorrowEntity } from 'src/core';

@Module({
  imports:[TypeOrmModule.forFeature([BorrowEntity, BookEntity, BookHistoryEntity])],
  controllers: [BorrowController],
  providers: [BorrowService],
})
export class BorrowModule {}
