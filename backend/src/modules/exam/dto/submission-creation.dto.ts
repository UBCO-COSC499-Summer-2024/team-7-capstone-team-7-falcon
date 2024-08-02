import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { ERROR_MESSAGES } from '../../../common'; // Adjust the path as necessary
import { Type } from 'class-transformer';
import 'reflect-metadata';

class AnswerDto {
  @IsNumber()
  question_num!: number;

  @IsNumber()
  score!: number;

  @IsArray()
  expected!: number[];

  @IsArray()
  answered!: number[];
}

class AnswersDto {
  @IsBoolean()
  errorFlag!: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answer_list!: AnswerDto[];
}

export class SubmissionCreationDto {
  @IsNumber(
    { maxDecimalPlaces: 3 },
    { message: ERROR_MESSAGES.submissionController.invalidGradeError },
  )
  @Min(0, { message: ERROR_MESSAGES.submissionController.minGradeError })
  @Max(100, { message: ERROR_MESSAGES.submissionController.maxGradeError })
  score!: number;

  @IsObject()
  @ValidateNested()
  @Type(() => AnswersDto)
  answers!: AnswersDto;

  @IsString()
  documentPath!: string;
}
