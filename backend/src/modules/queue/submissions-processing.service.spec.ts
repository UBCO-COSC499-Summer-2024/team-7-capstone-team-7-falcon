import { Test, TestingModule } from '@nestjs/testing';
import { Queue } from 'bull';
import Redis from 'ioredis';
import { BullModule, getQueueToken } from '@nestjs/bull';
import { SubmissionsProcessingService } from './jobs/submissions-processing.service';
import { SubmissionsProcessingJobDto } from './dto/submissions-processing-job.dto';
import { JobCreationException } from '../../common/errors';

describe('SubmissionsProcessingJobDto', () => {
  let service: SubmissionsProcessingService;
  let redis: Redis;
  let queue: Queue;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    redis = new Redis();
  });

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [SubmissionsProcessingService],
      imports: [
        BullModule.forRoot({
          redis: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT) || 6379,
          },
        }),
        BullModule.registerQueue({
          name: 'omr-submissions-processing',
        }),
      ],
    }).compile();

    service = moduleRef.get<SubmissionsProcessingService>(
      SubmissionsProcessingService,
    );
    queue = moduleRef.get<Queue>(getQueueToken('omr-submissions-processing'));
  });

  afterAll(async () => {
    await queue.close();
    await redis.quit();
  });

  afterEach(async () => {
    await queue.close();
    await redis.flushall();
  });

  describe('createJob', () => {
    it('should add a new job to the queue and return job id', async () => {
      const payload: SubmissionsProcessingJobDto = {
        payload: {
          examId: 1,
          courseId: 1,
          folderName: '1',
        },
      };

      const job = await service.createJob(payload);
      expect(job).toBeDefined();

      expect(job).toBe('1');
    });

    it('should throw an exception when the job creation fails', async () => {
      await queue.close();

      const payload: SubmissionsProcessingJobDto = {
        payload: {
          examId: 1,
          courseId: 1,
          folderName: '1',
        },
      };

      await expect(service.createJob(payload)).rejects.toThrow(
        JobCreationException,
      );

      queue = moduleRef.get<Queue>(getQueueToken('omr-submissions-processing'));
    });
  });

  describe('getJobById', () => {
    it('should get a job by its ID', async () => {
      const payload: SubmissionsProcessingJobDto = {
        payload: {
          examId: 1,
          courseId: 1,
          folderName: '1',
        },
      };

      const jobId = await service.createJob(payload);
      const job = await service.getJobById(jobId);
      expect(job).toBeDefined();
      expect(job.id).toBe(jobId);
    });

    it('should return null for a non-existent job', async () => {
      const job = await service.getJobById('non-existent-job-id');
      expect(job).toBeNull();
    });
  });

  describe('pickUpJob', () => {
    it('should pick up a job from the queue', async () => {
      const payload: SubmissionsProcessingJobDto = {
        payload: {
          examId: 1,
          courseId: 1,
          folderName: '1',
        },
      };

      await service.createJob(payload);
      const job = await service.pickUpJob();
      expect(job).toBeDefined();
      expect(job?.data.status).toBe('picked');
    });

    it('should return null when there are no jobs in the queue', async () => {
      const job = await service.pickUpJob();
      expect(job).toBeNull();
    }, 10_000);
  });

  describe('markJobAsComplete', () => {
    it('should mark a job as completed', async () => {
      const payload: SubmissionsProcessingJobDto = {
        payload: {
          examId: 1,
          courseId: 1,
          folderName: '1',
        },
      };

      const jobId = await service.createJob(payload);
      await service.pickUpJob();

      await service.markJobAsComplete(jobId);

      const job = await service.getJobById(jobId);
      expect(job).toBeDefined();
    });

    it('should throw an error when the job is not active', async () => {
      const payload: SubmissionsProcessingJobDto = {
        payload: {
          examId: 1,
          courseId: 1,
          folderName: '1',
        },
      };

      const jobId = await service.createJob(payload);

      await expect(service.markJobAsComplete(jobId)).rejects.toThrow(Error);
    });

    it('should throw an exception when the job is not found', async () => {
      await expect(
        service.markJobAsComplete('non-existent-job-id'),
      ).rejects.toThrow();
    });
  });
});
