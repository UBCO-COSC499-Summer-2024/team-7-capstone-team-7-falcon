import {
  IsInt,
  IsJSON,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class ExamCreateDto {
  @IsString()
  @MinLength(2)
  exam_name!: string;

  @IsInt()
  exam_date!: number;

  @IsJSON()
  @IsOptional()
  payload?: JSON;
}
