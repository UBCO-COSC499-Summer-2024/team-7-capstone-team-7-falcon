import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { BubbleSheetCreationJobDto } from '../dto/bubble-sheet-creation-job.dto';
import { SubmissionsProcessingJobDto } from '../dto/submissions-processing-job.dto';
import { plainToInstance } from 'class-transformer';
import { QueueNotFoundException } from '../../../common/errors';

@Injectable()
export class QueueValidationPipe implements PipeTransform {
  constructor(private readonly queueName: string) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async transform(value: any, _metadata: ArgumentMetadata) {
    let dtoInstance: any;
    switch (this.queueName) {
      case 'bubble-sheet-creation':
        dtoInstance = plainToInstance(BubbleSheetCreationJobDto, value);
        await validateOrReject(dtoInstance).catch((errors) => {
          throw new BadRequestException(
            `Validation failed for BubbleSheetCreationJobDto: ${errors}`,
          );
        });
        break;

      case 'omr-submissions-processing':
        dtoInstance = plainToInstance(SubmissionsProcessingJobDto, value);
        await validateOrReject(dtoInstance).catch((errors) => {
          throw new BadRequestException(
            `Validation failed for SubmissionsProcessingJobDto: ${errors}`,
          );
        });

        break;

      default:
        throw new QueueNotFoundException();
    }

    return dtoInstance;
  }
}

/**
 * Create a queue validation pipe
 * @param queueName {string} Queue name
 * @returns {QueueValidationPipe} Queue validation pipe
 */
export const createQueueValidationPipe = (queueName: string) => {
  return new QueueValidationPipe(queueName);
};
