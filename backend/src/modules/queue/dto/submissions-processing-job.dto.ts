import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import 'reflect-metadata';

/**
 * Data transfer object for the SubmissionsProcessingPayload
 */
class SubmissionsProcessingPayloadDto {
  @IsNumber()
  examId!: number;

  @IsNumber()
  courseId!: number;

  @IsString()
  folderName!: string;
}

/**
 * Data transfer object for the SubmissionsProcessingJob
 */
export class SubmissionsProcessingJobDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => SubmissionsProcessingPayloadDto)
  payload!: SubmissionsProcessingPayloadDto;
}
