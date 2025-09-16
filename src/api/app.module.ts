import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbConfig } from 'src/config';
import { UsersModule } from './users/users.module';
import { BookModule } from './book/book.module';
import { BorrowModule } from './borrow/borrow.module';
import { BookHistoryModule } from './book-history/book-history.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: dbConfig.DB_URL,
      autoLoadEntities: true,
      synchronize:true,
      entities: ['dist/core/entity/*.entity{.ts,.js}'],
    }),
    JwtModule.register({ global: true }),
    UsersModule,
    BookModule,
    BorrowModule,
    BookHistoryModule,
  ],
  providers: [],
})
export class AppModule {}
