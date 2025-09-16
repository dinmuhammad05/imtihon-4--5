import { Column, Entity, OneToMany } from 'typeorm';
import { BorrowEntity } from './borrow.entity';
import { BookHistoryEntity } from './book-history.entity';
import { BaseEntity } from 'src/infrastructure';

@Entity('books')
export class BookEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'varchar' })
  author: string;

  @Column({ type: 'integer', nullable: true })
  published_year: number;

  @Column({ type: 'boolean', default: true })
  available: Boolean;

  @OneToMany(() => BorrowEntity, (borrow) => borrow.book, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  borrows: BorrowEntity[];

  @OneToMany(() => BookHistoryEntity, (history) => history, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  book_histories: BookHistoryEntity[];
}
