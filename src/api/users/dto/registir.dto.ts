import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsString } from 'class-validator';

export class RegistrDto extends OmitType(CreateUserDto, ['role']) {}
