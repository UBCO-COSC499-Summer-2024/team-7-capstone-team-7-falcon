import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { BubbleSheetCreationService } from './jobs/bubble-sheet-creation.service';
import { Response } from 'express';
import { AuthGuard } from '../../guards/auth.guard';
import { SystemRoleGuard } from '../../guards/system-role.guard';
import { UserRoleEnum } from '../../enums/user.enum';
import { Roles } from '../../decorators/roles.decorator';
import {
  BubbleSheetCreationJobDto,
  BubbleSheetCompletionJobDto,
} from './dto/bubble-sheet-creation-job.dto';
import { Job } from 'bull';
import { QueueAuthGuard } from '../../guards/queue-auth.guard';
import {
  CouldNotCompleteJobException,
  QueueNotFoundException,
} from '../../common/errors';
import { SubmissionsProcessingService } from './jobs/submissions-processing.service';
import { SubmissionsProcessingJobDto } from './dto/submissions-processing-job.dto';
import { createQueueValidationPipe } from './pipes/queue-validation.pipe';

@Controller('queue')
export class QueueController {
  /**
   * Constructor
   * @param bubbleSheetCreationQueueService {BubbleSheetCreationService} Bubble sheet creation queue service
   * @param submissionsProcessingQueueService {SubmissionsProcessingService} Submissions processing queue service
   */
  constructor(
    private readonly bubbleSheetCreationQueueService: BubbleSheetCreationService,
    private readonly submissionsProcessingQueueService: SubmissionsProcessingService,
  ) {}

  /**
   * Add a job to the queue
   * @param res {Response} Response object
   * @param payload {BubbleSheetCreationJobDto} Job payload
   * @returns {Promise<Response>} Response object
   */
  @UseGuards(AuthGuard, SystemRoleGuard)
  @Roles(UserRoleEnum.PROFESSOR)
  @Post(':queue/add')
  async addJobToQueue(
    @Res() res: Response,
    @Param('queue') queueName: string,
    @Body(new ValidationPipe({ transform: true }))
    payload: BubbleSheetCreationJobDto | SubmissionsProcessingJobDto,
  ): Promise<Response> {
    try {
      let jobId: string = null;
      const validationPipe = createQueueValidationPipe(queueName);
      await validationPipe.transform(payload, { type: 'body' });

      switch (queueName) {
        case 'bubble-sheet-creation':
          jobId = await this.bubbleSheetCreationQueueService.createJob(
            payload as BubbleSheetCreationJobDto,
          );
          break;
        case 'omr-submissions-processing':
          jobId = await this.submissionsProcessingQueueService.createJob(
            payload as SubmissionsProcessingJobDto,
          );
          break;
      }

      return res.status(HttpStatus.ACCEPTED).send({ jobId });
    } catch (e) {
      if (e instanceof QueueNotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).send({ message: e.message });
      } else if (e instanceof BadRequestException) {
        return res.status(HttpStatus.BAD_REQUEST).send({ message: e.message });
      } else {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ message: e.message });
      }
    }
  }

  /**
   * Pick up a job from the queue
   * @param res {Response} Response object
   * @param queueName {string} Queue name
   * @returns {Promise<Response>} Response object
   */
  @UseGuards(QueueAuthGuard)
  @Get(':queue/pick')
  async pickUpJob(
    @Res() res: Response,
    @Param('queue') queueName: string,
  ): Promise<Response> {
    let job: Job | null;
    switch (queueName) {
      case 'bubble-sheet-creation':
        job = await this.bubbleSheetCreationQueueService.pickUpJob();
        break;
      case 'omr-submissions-processing':
        job = await this.submissionsProcessingQueueService.pickUpJob();
        break;
      default:
        return res.status(HttpStatus.BAD_REQUEST).send();
    }

    if (!job) {
      return res.status(HttpStatus.NOT_FOUND).send();
    } else {
      return res.status(HttpStatus.OK).send(job);
    }
  }

  /**
   * Get a job by its ID
   * @param res {Response} Response object
   * @param queueName {string} Queue name
   * @param jobId {string} Job ID
   * @returns {Promise<Response>} Response object
   */
  @UseGuards(AuthGuard, SystemRoleGuard)
  @Roles(UserRoleEnum.PROFESSOR)
  @Get(':queue/:jobId')
  async getJobById(
    @Res() res: Response,
    @Param('queue') queueName: string,
    @Param('jobId') jobId: string,
  ): Promise<Response> {
    try {
      let job: Job | null;
      switch (queueName) {
        case 'bubble-sheet-creation':
          job = await this.bubbleSheetCreationQueueService.getJobById(jobId);
          break;
        case 'omr-submissions-processing':
          job = await this.submissionsProcessingQueueService.getJobById(jobId);
          break;
        default:
          throw new QueueNotFoundException();
      }
      return res.status(HttpStatus.OK).send(job);
    } catch (e) {
      if (e instanceof QueueNotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).send({ message: e.message });
      } else {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ message: e.message });
      }
    }
  }

  /**
   * Mark a job as completed
   * @param res {Response} Response object
   * @param queueName {string} Queue name
   * @param jobId {string} Job ID
   * @param result {BubbleSheetCompletionJobDto} Job result
   * @returns {Promise<Response>} Response object
   */
  @UseGuards(QueueAuthGuard)
  @Patch(':queue/:jobId/complete')
  async markJobAsComplete(
    @Res() res: Response,
    @Param('queue') queueName: string,
    @Param('jobId') jobId: string,
    @Body(new ValidationPipe()) result: BubbleSheetCompletionJobDto,
  ): Promise<Response> {
    try {
      switch (queueName) {
        case 'bubble-sheet-creation':
          await this.bubbleSheetCreationQueueService.markJobAsComplete(
            jobId,
            result,
          );
          break;
        case 'omr-submissions-processing':
          await this.submissionsProcessingQueueService.markJobAsComplete(jobId);
          break;
        default:
          throw new QueueNotFoundException();
      }
      return res.status(HttpStatus.OK).send({ message: 'ok' });
    } catch (e) {
      if (e instanceof CouldNotCompleteJobException) {
        return res.status(HttpStatus.BAD_REQUEST).send({ message: e.message });
      } else if (e instanceof QueueNotFoundException) {
        return res.status(HttpStatus.NOT_FOUND).send({ message: e.message });
      } else {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send({ message: e.message });
      }
    }
  }
}
