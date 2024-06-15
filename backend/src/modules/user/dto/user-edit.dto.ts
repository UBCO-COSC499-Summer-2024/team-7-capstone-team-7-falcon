import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { ERROR_MESSAGES } from '../../../common';

export class UserEditDto {
  @IsString({ message: ERROR_MESSAGES.userEditDto.firstNameString })
  @IsNotEmpty({ message: ERROR_MESSAGES.userEditDto.firstNameRequired })
  @Length(2, 15, { message: ERROR_MESSAGES.userEditDto.firstNameLength })
  readonly first_name!: string;

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
