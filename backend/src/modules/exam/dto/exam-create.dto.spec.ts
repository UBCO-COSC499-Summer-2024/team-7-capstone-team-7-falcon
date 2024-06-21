import { plainToInstance } from 'class-transformer';
import { ExamCreateDto } from './exam-create.dto';
import { validate } from 'class-validator';

describe('ExamCreateDto', () => {
  it('should be defined', () => {
    expect(new ExamCreateDto()).toBeDefined();
  });

  it('should validate a valid payload', () => {
    const payload: ExamCreateDto = {
      exam_date: 1_000_000_000,
      exam_name: 'Test Exam',
    };

    const dto = plainToInstance(ExamCreateDto, payload);
    expect(dto).toBeDefined();
    expect(dto.exam_date).toBe(1_000_000_000);
    expect(dto.exam_name).toBe('Test Exam');
    const errors = validate(dto);

    expect(errors).resolves.toHaveLength(0);
  });

  it('should not validate an invalid payload', () => {
    const payload = {
      invalidPayload: 'invalid',
    };

    const dto = plainToInstance(ExamCreateDto, payload);
    expect(dto).toBeDefined();

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(2);
  });
});
