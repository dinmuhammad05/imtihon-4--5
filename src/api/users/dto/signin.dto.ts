import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class SigninDto extends OmitType(CreateUserDto, ['full_name', 'role']) {}
