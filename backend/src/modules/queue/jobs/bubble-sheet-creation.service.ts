import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bull';
import { IJobQueueService } from 'src/common/interfaces';
import {
  BubbleSheetCompletionJobDto,
  BubbleSheetCreationJobDto,
} from '../dto/bubble-sheet-creation-job.dto';
import {
  CouldNotCompleteJobException,
  JobCreationException,
  JobNotFoundException,
} from '../../../common/errors';

@Injectable()
export class BubbleSheetCreationService implements IJobQueueService {
  /**
   * Constructor
   * @param bubbleSheetCreationQueue {Queue} Bull queue
   */
  constructor(
    @InjectQueue('bubble-sheet-creation')
    private readonly bubbleSheetCreationQueue: Queue,
  ) {}

  /**
   * Add a new job to the queue
   * @param payload {BubbleSheetCreationJobDto} Job payload
   * @returns {Promise<string>} Job ID
   */
  async createJob(payload: BubbleSheetCreationJobDto): Promise<string> {
    try {
      const job: Job = await this.bubbleSheetCreationQueue.add(payload);
      return job.id.toString();
    } catch (e) {
      throw new JobCreationException(e.message);
    }
  }

  /**
   * Get a job by its ID
   * @param jobId {string} Job ID
   * @returns {Promise<Job | null>} Job object or null
   */
  async getJobById(jobId: string): Promise<Job | null> {
    return this.bubbleSheetCreationQueue.getJob(jobId);
  }

  /**
   * Pick up a job from the queue
   * @returns {Promise<Job | null>} Job object or null
   */
  async pickUpJob(): Promise<Job | null> {
    const job = await this.bubbleSheetCreationQueue.getNextJob();
    if (job) {
      job.update({ ...job.data, status: 'picked' });
      return job;
    }
    return null;
  }

  /**
   * Mark a job as completed
   * @param jobId {string} Job ID
   * @param result {BubbleSheetCompletionJobDto} Job result
   */
  async markJobAsComplete(
    jobId: string,
    result: BubbleSheetCompletionJobDto,
  ): Promise<void> {
    const job = await this.bubbleSheetCreationQueue.getJob(jobId);
    if (job) {
      try {
        if (job.isActive()) {
          await job.update({ ...result, status: 'completed' });
          await job.moveToCompleted();
        }
      } catch (e) {
        throw new CouldNotCompleteJobException(
          `Could not complete job ${jobId}.`,
        );
      }
    } else {
      throw new JobNotFoundException();
    }
  }
}
