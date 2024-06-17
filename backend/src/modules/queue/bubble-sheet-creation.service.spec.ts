import { Test, TestingModule } from '@nestjs/testing';
import { BullModule, getQueueToken } from '@nestjs/bull';
import { Queue } from 'bull';
import { BubbleSheetCreationService } from './jobs/bubble-sheet-creation.service';
import {
  BubbleSheetCreationJobDto,
  BubbleSheetCompletionJobDto,
} from './dto/bubble-sheet-creation-job.dto';
import { JobCreationException } from '../../common/errors';
import Redis from 'ioredis';

describe('BubbleSheetCreationService', () => {
  let service: BubbleSheetCreationService;
  let redis: Redis;
  let queue: Queue;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    redis = new Redis();
  });

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [BubbleSheetCreationService],
      imports: [
        BullModule.forRoot({
          redis: {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT) || 6379,
          },
        }),
        BullModule.registerQueue({
          name: 'bubble-sheet-creation',
        }),
      ],
    }).compile();

    service = moduleRef.get<BubbleSheetCreationService>(
      BubbleSheetCreationService,
    );
    queue = moduleRef.get<Queue>(getQueueToken('bubble-sheet-creation'));
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
      const payload: BubbleSheetCreationJobDto = {
        payload: {
          numberOfQuestions: 50,
          defaultPointsPerQuestion: 1,
          numberOfAnswers: 5,
          instructions: 'Default instructions',
        },
      };

      const job = await service.createJob(payload);
      expect(job).toBeDefined();
      expect(job).toBe('1');
    });

    it('should throw an error when adding a job to the queue fails', async () => {
      await queue.close();

      const payload: BubbleSheetCreationJobDto = {
        payload: {
          numberOfQuestions: 50,
          defaultPointsPerQuestion: 1,
          numberOfAnswers: 5,
          instructions: 'Default instructions',
        },
      };

      await expect(service.createJob(payload)).rejects.toThrow(
        JobCreationException,
      );

      queue = moduleRef.get<Queue>(getQueueToken('bubble-sheet-creation'));
    });
  });

  describe('getJobById', () => {
    it('should return a job by its id', async () => {
      const payload: BubbleSheetCreationJobDto = {
        payload: {
          numberOfQuestions: 50,
          defaultPointsPerQuestion: 1,
          numberOfAnswers: 5,
          instructions: 'Default instructions',
        },
      };

      const jobId = await service.createJob(payload);
      const job = await service.getJobById(jobId);

      expect(job).toBeDefined();
      expect(job?.id).toBe('1');
    });

    it('should return null when the job does not exist', async () => {
      const job = await service.getJobById('1');

      expect(job).toBeNull();
    });
  });

  describe('pickUpJob', () => {
    it('should pick up a job from the queue', async () => {
      const payload: BubbleSheetCreationJobDto = {
        payload: {
          numberOfQuestions: 50,
          defaultPointsPerQuestion: 1,
          numberOfAnswers: 5,
          instructions: 'Default instructions',
        },
      };

      await service.createJob(payload);
      const job = await service.pickUpJob();

      expect(job).toBeDefined();
      expect(job?.id).toBe('1');
    });

    it('should return null when the queue is empty', async () => {
      const job = await service.pickUpJob();

      expect(job).toBeNull();
    }, 10_000);
  });

  describe('markJobAsComplete', () => {
    it('should mark a job as complete', async () => {
      const payload: BubbleSheetCreationJobDto = {
        payload: {
          numberOfQuestions: 50,
          defaultPointsPerQuestion: 1,
          numberOfAnswers: 5,
          instructions: 'Default instructions',
        },
      };

      const jobId = await service.createJob(payload);
      await service.pickUpJob();

      const result: BubbleSheetCompletionJobDto = {
        payload: {
          filePath: 'path/to/file',
        },
      };

      await service.markJobAsComplete(jobId, result);

      const job = await service.getJobById(jobId);

      expect(job).toBeDefined();
    });

    it('should throw an error when the job is not active', async () => {
      const payload: BubbleSheetCreationJobDto = {
        payload: {
          numberOfQuestions: 50,
          defaultPointsPerQuestion: 1,
          numberOfAnswers: 5,
          instructions: 'Default instructions',
        },
      };

      const jobId = await service.createJob(payload);

      const result: BubbleSheetCompletionJobDto = {
        payload: {
          filePath: 'path/to/file',
        },
      };

      await expect(service.markJobAsComplete(jobId, result)).rejects.toThrow(
        Error,
      );
    });

    it('should throw an error when the job is not found', async () => {
      const result: BubbleSheetCompletionJobDto = {
        payload: {
          filePath: 'path/to/file',
        },
      };

      await expect(service.markJobAsComplete('-333', result)).rejects.toThrow(
        Error,
      );
    });
  });
});
