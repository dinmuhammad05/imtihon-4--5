import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class ConfirmOTPDto {
  @ApiProperty({
    type: 'string',
    description: 'email',
    example: 'abdurazzoqov@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: 'number',
    description: 'otp',
    example: 123456,
  })
  @IsNumber()
  @IsNotEmpty()
  otp: number;
}
