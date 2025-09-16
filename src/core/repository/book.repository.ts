import { Repository } from 'typeorm';
import { BookEntity } from '../entity/book.entity';

export type BookRepository = Repository<BookEntity>;
