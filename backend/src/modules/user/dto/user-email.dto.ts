import { IsEmail, IsNotEmpty } from 'class-validator';
import { ERROR_MESSAGES } from '../../../common';

export class UserEmailDto {
  @IsEmail({}, { message: ERROR_MESSAGES.common.emailInvalid })
  @IsNotEmpty({ message: ERROR_MESSAGES.common.emailRequired })
  readonly email!: string;
}
