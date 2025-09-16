import { Repository } from 'typeorm';
import { BorrowEntity } from '../entity/borrow.entity';

export type BorrowRepository = Repository<BorrowEntity>;
