import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { BubbleSheetCreationService } from './jobs/bubble-sheet-creation.service';
import {
  BubbleSheetCompletionJobDto,
  BubbleSheetCreationJobDto,
} from './dto/bubble-sheet-creation-job.dto';
import { JobCreationException } from '../../common/errors';

describe('BubbleSheetCreationService', () => {
  let service: BubbleSheetCreationService;
  let queue: Queue;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BubbleSheetCreationService,
        {
          provide: getQueueToken('bubble-sheet-creation'),
          useValue: {
            add: jest.fn(),
            getJob: jest.fn(),
            getNextJob: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<BubbleSheetCreationService>(
      BubbleSheetCreationService,
    );
    queue = module.get<Queue>(getQueueToken('bubble-sheet-creation'));
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
      const mockJob = { id: '123' } as Job;

      (queue.add as jest.Mock).mockResolvedValue(mockJob);

      const jobId = await service.createJob(payload);

      expect(queue.add).toHaveBeenCalledWith(payload);
      expect(jobId).toBe(mockJob.id.toString());
    });

    it('should throw JobCreationException if job creation fails', async () => {
      const payload: BubbleSheetCreationJobDto = {
        payload: {
          numberOfQuestions: 50,
          defaultPointsPerQuestion: 1,
          numberOfAnswers: 5,
          instructions: 'Default instructions',
        },
      };
      (queue.add as jest.Mock).mockRejectedValue(
        new Error('Failed to add job'),
      );

      await expect(service.createJob(payload)).rejects.toThrow(
        JobCreationException,
      );
    });
  });

  describe('getJobById', () => {
    it('should return the job by its ID', async () => {
      const jobId = '123';
      const mockJob = { id: jobId } as Job;

      (queue.getJob as jest.Mock).mockResolvedValue(mockJob);

      const job = await service.getJobById(jobId);

      expect(queue.getJob).toHaveBeenCalledWith(jobId);
      expect(job).toBe(mockJob);
    });

    it('should return null if job not found', async () => {
      const jobId = '123';

      (queue.getJob as jest.Mock).mockResolvedValue(null);

      const job = await service.getJobById(jobId);

      expect(queue.getJob).toHaveBeenCalledWith(jobId);
      expect(job).toBeNull();
    });
  });

  describe('pickUpJob', () => {
    it('should pick up the next job from the queue and update its status', async () => {
      const mockJob = {
        id: '123',
        data: {},
        update: jest.fn(),
      } as unknown as Job;

      (queue.getNextJob as jest.Mock).mockResolvedValue(mockJob);

      const job = await service.pickUpJob();

      expect(queue.getNextJob).toHaveBeenCalled();
      expect(mockJob.update).toHaveBeenCalledWith({
        ...mockJob.data,
        status: 'picked',
      });
      expect(job).toBe(mockJob);
    });

    it('should return null if no job is available', async () => {
      (queue.getNextJob as jest.Mock).mockResolvedValue(null);

      const job = await service.pickUpJob();

      expect(queue.getNextJob).toHaveBeenCalled();
      expect(job).toBeNull();
    });
  });

  describe('markJobAsComplete', () => {
    it('should mark an active job as completed', async () => {
      const jobId = '123';
      const result: BubbleSheetCompletionJobDto = {
        payload: {
          filePath: 'fake_path',
        },
      };
      const mockJob = {
        id: jobId,
        isActive: jest.fn().mockReturnValue(true),
        update: jest.fn(),
        moveToCompleted: jest.fn(),
      } as unknown as Job;

      (queue.getJob as jest.Mock).mockResolvedValue(mockJob);

      await service.markJobAsComplete(jobId, result);

      expect(queue.getJob).toHaveBeenCalledWith(jobId);
      expect(mockJob.isActive).toHaveBeenCalled();
      expect(mockJob.update).toHaveBeenCalledWith({
        ...result,
        status: 'completed',
      });
      expect(mockJob.moveToCompleted).toHaveBeenCalled();
    });

    it('should throw an error if job is not active', async () => {
      const jobId = '123';
      const result: BubbleSheetCompletionJobDto = {
        payload: {
          filePath: 'fake_path',
        },
      };
      const mockJob = {
        id: jobId,
        isActive: jest.fn().mockReturnValue(false),
      } as unknown as Job;

      (queue.getJob as jest.Mock).mockResolvedValue(mockJob);

      await expect(service.markJobAsComplete(jobId, result)).rejects.toThrow(
        `Job ${jobId} is not in the active state.`,
      );
    });
  });
});
