import { plainToInstance } from 'class-transformer';
import { SemesterCreateDto } from './semester-create.dto';
import { validate } from 'class-validator';

describe('SemesterCreateDto', () => {
  it('should be defined', () => {
    expect(new SemesterCreateDto()).toBeDefined();
  });

  it('should validate a valid payload', () => {
    const payload: SemesterCreateDto = {
      name: 'Test Semester',
      starts_at: 1_000_000,
      ends_at: 1_000_000,
    };

    const dto = plainToInstance(SemesterCreateDto, payload);
    expect(dto).toBeDefined();
    expect(dto.name).toBe('Test Semester');
    expect(dto.starts_at).toBe(1_000_000);
    expect(dto.ends_at).toBe(1_000_000);
    const errors = validate(dto);

    expect(errors).resolves.toHaveLength(0);
  });

  it('should not validate an invalid payload', () => {
    const payload = {
      invalidPayload: 'invalid',
    };

    const dto = plainToInstance(SemesterCreateDto, payload);
    expect(dto).toBeDefined();

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(3);
  });
});
