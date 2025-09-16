import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { UserEntity } from './user.entity';
import { BookEntity } from './book.entity';
import { BaseEntity } from 'src/infrastructure';

export enum Action {
  BORROW = 'borrow',
  RETURN = 'return',
}

@Entity('book_history')
export class BookHistoryEntity extends BaseEntity {
  @Column({ type: 'enum', enum: Action, default : Action.BORROW })
  action: Action;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  date: Date;

  @Column({ type: 'uuid', nullable: false })
  bookId: string;

   @Column({ type: 'uuid', nullable: false })
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.book_history, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => BookEntity, (book) => book.book_histories, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'bookId' })
  book: BookEntity;
}
