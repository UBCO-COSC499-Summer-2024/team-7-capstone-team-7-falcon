import { plainToInstance } from 'class-transformer';
import {
  BubbleSheetCompletionJobDto,
  BubbleSheetCreationJobDto,
} from './bubble-sheet-creation-job.dto';
import { validate } from 'class-validator';

describe('BubbleSheetCreationJobDto', () => {
  it('should be defined', () => {
    expect(new BubbleSheetCreationJobDto()).toBeDefined();
  });

  it('should validate a valid payload', () => {
    const payload: BubbleSheetCreationJobDto = {
      payload: {
        numberOfQuestions: 50,
        defaultPointsPerQuestion: 1,
        numberOfAnswers: 5,
        examName: 'Exam name',
        courseCode: 'Course code',
        courseName: 'Course name',
        answers: [
          [1, 2, 3, 4, 5],
          [1, 2, 3, 4, 5],
          [1, 2, 3, 4, 5],
        ],
      },
    };

    const dto = plainToInstance(BubbleSheetCreationJobDto, payload);
    expect(dto).toBeDefined();
    expect(dto.payload.numberOfQuestions).toBe(50);
    expect(dto.payload.defaultPointsPerQuestion).toBe(1);
    expect(dto.payload.numberOfAnswers).toBe(5);
    expect(dto.payload.examName).toBe('Exam name');
    expect(dto.payload.courseCode).toBe('Course code');
    expect(dto.payload.courseName).toBe('Course name');
    const errors = validate(dto);

    expect(errors).resolves.toHaveLength(0);
  });

  it('should not validate an invalid payload', () => {
    const payload = {
      invalidPayload: 'invalid',
    };

    const dto = plainToInstance(BubbleSheetCreationJobDto, payload);
    expect(dto).toBeDefined();

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(1);
  });
});

describe('BubbleSheetCompletionJobDto', () => {
  it('should be defined', () => {
    expect(new BubbleSheetCompletionJobDto()).toBeDefined();
  });

  it('should validate a valid payload', () => {
    const payload: BubbleSheetCompletionJobDto = {
      payload: {
        filePath: '1',
      },
    };

    const dto = plainToInstance(BubbleSheetCompletionJobDto, payload);
    expect(dto).toBeDefined();
    expect(dto.payload.filePath).toBe('1');
    const errors = validate(dto);

    expect(errors).resolves.toHaveLength(0);
  });

  it('should not validate an invalid payload', () => {
    const payload = {
      invalidPayload: 'invalid',
    };

    const dto = plainToInstance(BubbleSheetCompletionJobDto, payload);
    expect(dto).toBeDefined();

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(1);
  });
});
