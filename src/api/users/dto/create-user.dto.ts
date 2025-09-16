import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { Roles } from 'src/common';

export class CreateUserDto {
  @ApiProperty({
    type: 'string',
    description: 'user full name',
    example: 'Suhrobey Abdurazzoqov',
  })
  @IsString()
  @IsNotEmpty()
  full_name: string;

  @ApiProperty({
    type: 'string',
    description: 'user email address',
    example: 'abdurazzoqov@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: 'string',
    description: 'user password',
    example: 'Developer1!',
  })
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;

  @IsEnum(Roles)
  @IsOptional()
  role?: Roles;
}
