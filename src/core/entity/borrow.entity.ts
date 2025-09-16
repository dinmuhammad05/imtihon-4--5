import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from 'src/infrastructure';
import { UserEntity } from './user.entity';
import { BookEntity } from './book.entity';

@Entity('borrows')
export class BorrowEntity extends BaseEntity {
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  borrow_date: Date;

  @Column({ type: 'integer' })
  due_date: number;

  @Column({ type: 'timestamp', nullable: true })
  return_date: Date;

  @Column({ type: 'boolean' })
  overdue: Boolean;

  @Column({ type: 'uuid' })
  userId: string;

   @Column({ type: 'uuid' })
  bookId: string;

  @ManyToOne(() => UserEntity, (user) => user.borrows, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => BookEntity, (book) => book.borrows, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'bookId' })
  book: BookEntity;
}
