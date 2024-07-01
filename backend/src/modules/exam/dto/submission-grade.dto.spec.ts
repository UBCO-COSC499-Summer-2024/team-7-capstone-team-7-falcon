import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { SubmissionGradeDto } from './submission-grade.dto';

describe('SubmissionGradeDto', () => {
  it('should be defined', () => {
    expect(new SubmissionGradeDto()).toBeDefined();
  });

  it('should validate a valid payload', () => {
    const payload: SubmissionGradeDto = {
      grade: 100,
    };

    const dto = plainToInstance(SubmissionGradeDto, payload);
    expect(dto).toBeDefined();
    expect(dto.grade).toBe(100);
    const errors = validate(dto);

    expect(errors).resolves.toHaveLength(0);
  });

  it('should accept a grade with three decimal places', () => {
    const payload: SubmissionGradeDto = {
      grade: 34.123,
    };

    const dto = plainToInstance(SubmissionGradeDto, payload);
    expect(dto).toBeDefined();
    expect(dto.grade).toBe(34.123);
    const errors = validate(dto);

    expect(errors).resolves.toHaveLength(0);
  });

  it('should not validate an invalid payload', () => {
    const payload = {
      grade: -1,
    };

    const dto = plainToInstance(SubmissionGradeDto, payload);
    expect(dto).toBeDefined();

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(1);
  });
});
