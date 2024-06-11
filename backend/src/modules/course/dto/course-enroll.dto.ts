import { IsNotEmpty, IsString } from 'class-validator';
import { ERROR_MESSAGES } from '../../../common';

export class CourseEnrollDto {
  @IsString()
  @IsNotEmpty({ message: ERROR_MESSAGES.courseEnrollDto.inviteCodeRequired })
  readonly invite_code!: string;
}
