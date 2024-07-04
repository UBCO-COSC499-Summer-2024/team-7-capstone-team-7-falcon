import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IBubbleSheetPayload } from '../../../common/interfaces';
import 'reflect-metadata';

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
  instructions!: string;

  @IsArray()
  @IsNumber({}, { each: true })
  answers!: number[];
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
