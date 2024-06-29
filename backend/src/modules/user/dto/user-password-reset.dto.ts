import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';
import { ERROR_MESSAGES } from '../../../common';
import { MatchPasswords } from '../../../decorators/match-passwords.decorator';

export class UserPasswordResetDto {
  @IsString({ message: ERROR_MESSAGES.tokenController.tokenString })
  @IsNotEmpty({ message: ERROR_MESSAGES.tokenController.tokenRequired })
  readonly token!: string;

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
}
