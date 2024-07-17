import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bull';
import {
  CouldNotCompleteJobException,
  JobCreationException,
  JobNotFoundException,
} from '../../../common/errors';
import { IJobQueueService } from '../../../common/interfaces';
import { SubmissionsProcessingJobDto } from '../dto/submissions-processing-job.dto';

@Injectable()
export class SubmissionsProcessingService implements IJobQueueService {
  constructor(
    @InjectQueue('omr-submissions-processing')
    private readonly submissionsProcessingQueue: Queue,
  ) {}

  /**
   * Add a new job to the queue
   * @param payload {SubmissionProcessingJobDto} Job payload
   */
  async createJob(payload: SubmissionsProcessingJobDto): Promise<string> {
    try {
      const job: Job = await this.submissionsProcessingQueue.add(payload);
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
    return this.submissionsProcessingQueue.getJob(jobId);
  }

  /**
   * Pick up a job from the queue
   * @returns {Promise<Job | null>} Job object or null
   */
  async pickUpJob(): Promise<Job | null> {
    const job = await this.submissionsProcessingQueue.getNextJob();
    if (job) {
      job.update({ ...job.data, status: 'picked' });
      return job;
    }
    return null;
  }

  /**
   * Mark a job as completed
   * @param jobId {string} Job ID
   */
  async markJobAsComplete(jobId: string): Promise<void> {
    const job = await this.submissionsProcessingQueue.getJob(jobId);
    if (job) {
      try {
        if (job.isActive()) {
          await job.update({ status: 'completed' });
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
