import { plainToInstance } from 'class-transformer';
import { CourseEnrollDto } from './course-enroll.dto';
import { validate } from 'class-validator';

describe('CourseEnrollDto', () => {
  it('should be defined', () => {
    expect(new CourseEnrollDto()).toBeDefined();
  });

  it('should validate a valid payload', () => {
    const payload: CourseEnrollDto = {
      invite_code: '123456',
    };

    const dto = plainToInstance(CourseEnrollDto, payload);
    expect(dto).toBeDefined();
    expect(dto.invite_code).toBe('123456');
    const errors = validate(dto);

    expect(errors).resolves.toHaveLength(0);
  });

  it('should not validate an invalid payload', () => {
    const payload = {
      invalidPayload: 'invalid',
    };

    const dto = plainToInstance(CourseEnrollDto, payload);
    expect(dto).toBeDefined();

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(1);
  });
});
