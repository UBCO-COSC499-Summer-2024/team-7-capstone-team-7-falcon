import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { ERROR_MESSAGES } from '../../../common';

export class SemesterCreateDto {
  @IsString()
  @IsNotEmpty({ message: ERROR_MESSAGES.semesterCreateDto.nameRequired })
  @Length(2, 15, { message: ERROR_MESSAGES.semesterCreateDto.nameLength })
  name!: string;

  @IsNumber()
  @IsNotEmpty({ message: ERROR_MESSAGES.semesterCreateDto.startsAtRequired })
  starts_at!: number;

  @IsNumber()
  @IsNotEmpty({ message: ERROR_MESSAGES.semesterCreateDto.endsAtRequired })
  ends_at!: number;
}
