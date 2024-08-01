import {
  IsBoolean,
  IsNumber,
  IsArray,
  ValidateNested,
  IsObject,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import 'reflect-metadata';

class Answer {
  @IsNumber()
  @Min(0)
  question_num!: number;

  @IsArray()
  @IsNumber({}, { each: true })
  expected!: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  answered!: number[];

  @IsNumber()
  @Min(0)
  @Max(100)
  score!: number;
}

class Answers {
  @IsBoolean()
  errorFlag!: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Answer)
  answer_list!: Answer[];
}

export class SubmissionGradeDto {
  @IsObject()
  @ValidateNested()
  @Type(() => Answers)
  answers!: Answers;
}
