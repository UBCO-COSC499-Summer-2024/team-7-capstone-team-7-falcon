import { plainToInstance } from 'class-transformer';
import { CourseArchiveDto } from './course-archive.dto';
import { validate } from 'class-validator';

describe('CourseArchiveDto', () => {
  it('should be defined', () => {
    expect(new CourseArchiveDto()).toBeDefined();
  });

  it('should validate a valid payload', () => {
    const payload: CourseArchiveDto = {
      archive: true,
    };

    const dto = plainToInstance(CourseArchiveDto, payload);
    expect(dto).toBeDefined();
    expect(dto.archive).toBe(true);
    const errors = validate(dto);

    expect(errors).resolves.toHaveLength(0);
  });

  it('should not validate an invalid payload', () => {
    const payload = {
      invalidPayload: 'invalid',
    };

    const dto = plainToInstance(CourseArchiveDto, payload);
    expect(dto).toBeDefined();

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(1);
  });
});
