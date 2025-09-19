import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from 'src/infrastructure';
import { Roles } from 'src/common';
import { BorrowEntity } from './borrow.entity';
import { BookHistoryEntity } from './book-history.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  full_name: string;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'enum', enum: Roles, default: Roles.READER })
  role: Roles;

  @OneToMany(() => BorrowEntity, (borrow) => borrow.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  borrows: BorrowEntity[];

  @OneToMany(() => BookHistoryEntity, (book) => book.user, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  book_history: BookHistoryEntity[];
}