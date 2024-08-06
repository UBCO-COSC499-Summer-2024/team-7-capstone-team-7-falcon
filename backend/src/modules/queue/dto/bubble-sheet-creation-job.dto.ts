import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { IBubbleSheetPayload } from '../../../common/interfaces';
import 'reflect-metadata';
import { ERROR_MESSAGES } from '../../../common';
import { Is2DNumberArray } from '../../../decorators/is-2d-number-array';

/**
 * Data transfer object for the BubbleSheetPayload
 */
class BubbleSheetPayloadDto implements IBubbleSheetPayload {
  @IsInt()
  numberOfQuestions!: number;

  @IsInt()
  defaultPointsPerQuestion!: number;

  @IsInt()
  numberOfAnswers!: number;

  @IsString()
  courseName!: string;

  @IsString()
  courseCode!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(46, { message: ERROR_MESSAGES.examController.examNameTooLong })
  examName!: string;

  @IsArray()
  @Is2DNumberArray({ message: ERROR_MESSAGES.common.invalid2DArray })
  answers!: number[][];
}

/**
 * Data transfer object for the BubbleSheetCreationJob
 */
export class BubbleSheetCreationJobDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => BubbleSheetPayloadDto)
  payload!: BubbleSheetPayloadDto;
}

/**
 * Data transfer object for the BubbleSheetCompletion
 */
class BubbleSheetCompletionDto {
  @IsString()
  filePath!: string;
}

/**
 * Data transfer object for the BubbleSheetCompletionJob
 */
export class BubbleSheetCompletionJobDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => BubbleSheetCompletionDto)
  payload!: BubbleSheetCompletionDto;
}
