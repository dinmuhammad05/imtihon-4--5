import { Module } from '@nestjs/common';
import { BookHistoryService } from './book-history.service';
import { BookHistoryController } from './book-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookHistoryEntity } from 'src/core';

@Module({
  imports: [TypeOrmModule.forFeature([BookHistoryEntity])],
  controllers: [BookHistoryController],
  providers: [BookHistoryService],
})
export class BookHistoryModule {}
