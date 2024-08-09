import { IsEnum, IsNotEmpty } from 'class-validator';
import { ERROR_MESSAGES } from '../../../common';
import { UserRoleEnum } from '../../../enums/user.enum';

export class UserRoleDto {
  @IsEnum(UserRoleEnum, { message: ERROR_MESSAGES.userRoleDto.userRoleInvalid })
  @IsNotEmpty({ message: ERROR_MESSAGES.userRoleDto.userRoleRequired })
  userRole!: UserRoleEnum;
}
