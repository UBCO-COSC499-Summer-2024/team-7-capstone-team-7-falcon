import { IsInt, IsOptional, IsString, Length, Min } from 'class-validator';
import { ERROR_MESSAGES } from '../../../common';

export class UserEditDto {
  @IsString({ message: ERROR_MESSAGES.userEditDto.firstNameString })
  @Length(2, 15, { message: ERROR_MESSAGES.userEditDto.firstNameLength })
  @IsOptional()
  readonly first_name?: string;

  @IsOptional()
  readonly last_name?: string;

  @IsInt({ message: ERROR_MESSAGES.userEditDto.studentNumberMustBeNumber })
  @Min(1, { message: ERROR_MESSAGES.userEditDto.studentNumberMustBeGreater })
  @IsOptional()
  readonly student_id?: number;

  @IsInt({ message: ERROR_MESSAGES.userEditDto.employeeNumberMustBeNumber })
  @Min(1, { message: ERROR_MESSAGES.userEditDto.employeeNumberMustBeGreater })
  @IsOptional()
  readonly employee_id?: number;
}
