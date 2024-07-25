import { BubbleSheetCreationJobDto } from '../dto/bubble-sheet-creation-job.dto';
import { createQueueValidationPipe } from './queue-validation.pipe';

describe('QueueValidationPipe', () => {
  it('should throw bad request exception for invalid queue name', async () => {
    const queueName = 'invalid-queue';
    const queueValidationPipe = createQueueValidationPipe(queueName);

    await expect(
      queueValidationPipe.transform({}, { type: 'body' }),
    ).rejects.toThrow('Queue not found');
  });

  it('should validate a valid payload for omr-submissions-processing queue', async () => {
    const queueName = 'omr-submissions-processing';
    const payload = {
      payload: {
        examId: 1,
        courseId: 1,
        folderName: '1',
      },
    };
    const queueValidationPipe = createQueueValidationPipe(queueName);

    const dto = await queueValidationPipe.transform(payload, { type: 'body' });
    expect(dto).toBeDefined();
    expect(dto.payload.examId).toBe(1);
    expect(dto.payload.courseId).toBe(1);
    expect(dto.payload.folderName).toBe('1');
  });

  it('should throw bad request exception for invalid payload for omr-submissions-processing queue', async () => {
    const queueName = 'omr-submissions-processing';
    const payload = {
      invalidPayload: 'invalid',
    };
    const queueValidationPipe = createQueueValidationPipe(queueName);

    await expect(
      queueValidationPipe.transform(payload, { type: 'body' }),
    ).rejects.toThrow('Validation failed for SubmissionsProcessingJobDto');
  });

  it('should throw bad request exception for invalid payload for bubble-sheet-creation queue', async () => {
    const queueName = 'bubble-sheet-creation';
    const payload = {
      invalidPayload: 'invalid',
    };
    const queueValidationPipe = createQueueValidationPipe(queueName);

    await expect(
      queueValidationPipe.transform(payload, { type: 'body' }),
    ).rejects.toThrow('Validation failed for BubbleSheetCreationJobDto');
  });

  it('should validate a valid payload for bubble-sheet-creation queue', async () => {
    const queueName = 'bubble-sheet-creation';
    const payload: BubbleSheetCreationJobDto = {
      payload: {
        numberOfQuestions: 50,
        defaultPointsPerQuestion: 1,
        numberOfAnswers: 5,
        courseName: 'Course name',
        courseCode: 'Course code',
        examName: 'Exam name',
        answers: [1, 2, 3, 4, 5],
      },
    };
    const queueValidationPipe = createQueueValidationPipe(queueName);

    const dto = await queueValidationPipe.transform(payload, { type: 'body' });
    expect(dto).toBeDefined();
    expect(dto.payload.numberOfQuestions).toBe(50);
    expect(dto.payload.defaultPointsPerQuestion).toBe(1);
    expect(dto.payload.numberOfAnswers).toBe(5);
    expect(dto.payload.courseName).toBe('Course name');
    expect(dto.payload.courseCode).toBe('Course code');
    expect(dto.payload.examName).toBe('Exam name');
    expect(dto.payload.answers).toEqual([1, 2, 3, 4, 5]);
  });
});
