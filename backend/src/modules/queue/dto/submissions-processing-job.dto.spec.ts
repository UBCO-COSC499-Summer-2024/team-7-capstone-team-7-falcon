import { plainToInstance } from 'class-transformer';
import { SubmissionsProcessingJobDto } from './submissions-processing-job.dto';
import { validate } from 'class-validator';

describe('SubmissionsProcessingJobDto', () => {
  it('should be defined', () => {
    expect(new SubmissionsProcessingJobDto()).toBeDefined();
  });

  it('should validate a valid payload', () => {
    const payload: SubmissionsProcessingJobDto = {
      payload: {
        examId: 1,
        courseId: 1,
        folderName: '1',
      },
    };

    const dto = plainToInstance(SubmissionsProcessingJobDto, payload);
    expect(dto).toBeDefined();
    expect(dto.payload.examId).toBe(1);
    expect(dto.payload.courseId).toBe(1);
    expect(dto.payload.folderName).toBe('1');
    const errors = validate(dto);

    expect(errors).resolves.toHaveLength(0);
  });

  it('should not validate an invalid payload', () => {
    const payload = {
      invalidPayload: 'invalid',
    };

    const dto = plainToInstance(SubmissionsProcessingJobDto, payload);
    expect(dto).toBeDefined();

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(1);
  });
});
