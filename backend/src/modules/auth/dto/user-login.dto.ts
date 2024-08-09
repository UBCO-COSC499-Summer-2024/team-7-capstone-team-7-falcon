import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ERROR_MESSAGES } from '../../../common';

export class UserLoginDto {
  @IsEmail()
  @IsNotEmpty({ message: ERROR_MESSAGES.common.emailRequired })
  email!: string;

  @IsString({ message: ERROR_MESSAGES.common.passwordString })
  @IsNotEmpty({ message: ERROR_MESSAGES.common.passwordRequired })
  password!: string;
}
