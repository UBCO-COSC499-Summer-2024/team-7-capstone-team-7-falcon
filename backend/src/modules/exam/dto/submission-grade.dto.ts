import { IsNumber, Max, Min } from 'class-validator';
import { ERROR_MESSAGES } from '../../../common';

export class SubmissionGradeDto {
  @IsNumber(
    { maxDecimalPlaces: 3 },
    { message: ERROR_MESSAGES.submissionController.invalidGradeError },
  )
  @Min(0, { message: ERROR_MESSAGES.submissionController.minGradeError })
  @Max(100, { message: ERROR_MESSAGES.submissionController.maxGradeError })
  grade!: number;
}
