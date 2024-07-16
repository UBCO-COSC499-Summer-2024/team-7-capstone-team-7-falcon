import { IsNumber, IsString, Max, Min, ValidateNested } from 'class-validator';
import { ERROR_MESSAGES } from '.././../../common';

export class SubmissionCreationDto {
  @IsNumber(
    { maxDecimalPlaces: 3 },
    { message: ERROR_MESSAGES.submissionController.invalidGradeError },
  )
  @Min(0, { message: ERROR_MESSAGES.submissionController.minGradeError })
  @Max(100, { message: ERROR_MESSAGES.submissionController.maxGradeError })
  score!: number;

  @ValidateNested()
  answers!: any;

  @IsString()
  documentPath!: string;
}
