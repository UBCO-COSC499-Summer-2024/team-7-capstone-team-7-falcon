import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
  Min,
} from 'class-validator';
import { ERROR_MESSAGES } from '../../../common';
import { MatchPasswords } from '../../../decorators/match-passwords.decorator';

export class UserCreateDto {
  @IsString({ message: ERROR_MESSAGES.userEditDto.firstNameString })
  @IsNotEmpty({ message: ERROR_MESSAGES.userEditDto.firstNameRequired })
  @Length(2, 15, { message: ERROR_MESSAGES.userEditDto.firstNameLength })
  readonly first_name!: string;

  @IsOptional()
  readonly last_name?: string;

  @IsEmail()
  @IsNotEmpty({ message: ERROR_MESSAGES.common.emailRequired })
  readonly email!: string;

  @IsString({ message: ERROR_MESSAGES.common.passwordString })
  @IsNotEmpty({ message: ERROR_MESSAGES.common.passwordRequired })
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    { message: ERROR_MESSAGES.common.passwordStrong },
  )
  readonly password!: string;

  @IsString({ message: ERROR_MESSAGES.common.confirmPasswordString })
  @IsNotEmpty({ message: ERROR_MESSAGES.common.confirmPasswordRequired })
  @MatchPasswords('password', {
    message: ERROR_MESSAGES.common.passwordMustMatch,
  })
  readonly confirm_password!: string;

  @IsInt({ message: ERROR_MESSAGES.userEditDto.studentNumberMustBeNumber })
  @Min(1, { message: ERROR_MESSAGES.userEditDto.studentNumberMustBeGreater })
  @IsOptional()
  readonly student_id?: number;

  @IsInt({ message: ERROR_MESSAGES.userEditDto.employeeNumberMustBeNumber })
  @Min(1, { message: ERROR_MESSAGES.userEditDto.employeeNumberMustBeGreater })
  @IsOptional()
  readonly employee_id?: number;
}
