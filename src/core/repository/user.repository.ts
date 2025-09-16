import { Repository } from 'typeorm';
import { UserEntity } from '../';

export type UserRepository = Repository<UserEntity>;
