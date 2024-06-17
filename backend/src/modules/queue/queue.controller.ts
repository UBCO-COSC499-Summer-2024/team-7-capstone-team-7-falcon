import {
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

@Controller('queue')
export class QueueController {
  constructor(
    private readonly bubbleSheetCreationQueueService: BubbleSheetCreationService,
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
    @Body(new ValidationPipe()) payload: BubbleSheetCreationJobDto,
  ): Promise<Response> {
    try {
      const jobId: string =
        await this.bubbleSheetCreationQueueService.createJob(payload);
      return res.status(HttpStatus.ACCEPTED).send({ jobId });
    } catch (e) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: e.message });
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
  @UseGuards(QueueAuthGuard)
  @Get(':queue/:jobId')
  async getJobById(
    @Res() res: Response,
    @Param('queue') queueName: string,
    @Param('jobId') jobId: string,
  ): Promise<Response> {
    let job: Job | null;
    switch (queueName) {
      case 'bubble-sheet-creation':
        job = await this.bubbleSheetCreationQueueService.getJobById(jobId);
        break;
      default:
        job = null;
    }
    return res.status(HttpStatus.OK).send(job);
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
    switch (queueName) {
      case 'bubble-sheet-creation':
        await this.bubbleSheetCreationQueueService.markJobAsComplete(
          jobId,
          result,
        );
        break;
      default:
    }
    return res.status(HttpStatus.OK).send({ message: 'ok' });
  }
}
