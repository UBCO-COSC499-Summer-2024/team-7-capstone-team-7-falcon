import {
  IsInt,
  IsJSON,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ERROR_MESSAGES } from '../../../common';

export class ExamCreateDto {
  @IsString()
  @MinLength(2)
  @MaxLength(46, { message: ERROR_MESSAGES.examController.examNameTooLong })
  exam_name!: string;

  @IsInt()
  exam_date!: number;

  @IsJSON()
  @IsOptional()
  payload?: JSON;
}
