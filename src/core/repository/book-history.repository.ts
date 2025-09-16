import { Repository } from 'typeorm';
import { BookHistoryEntity } from '../entity/book-history.entity';

export type BookHisRepository = Repository<BookHistoryEntity>;
