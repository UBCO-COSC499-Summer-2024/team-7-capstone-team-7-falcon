import { plainToInstance } from 'class-transformer';
import { CourseEditDto } from './course-edit.dto';
import { validate } from 'class-validator';

describe('CourseEditDto', () => {
  it('should be defined', () => {
    expect(new CourseEditDto()).toBeDefined();
  });

  it('should validate a valid payload', () => {
    const payload: CourseEditDto = {
      courseCode: 'Test Course',
      courseName: 'Test Description',
      semesterId: 1,
      inviteCode: 'invite-code',
    };

    const dto = plainToInstance(CourseEditDto, payload);
    expect(dto).toBeDefined();
    expect(dto.courseCode).toBe('Test Course');
    expect(dto.courseName).toBe('Test Description');
    expect(dto.semesterId).toBe(1);
    expect(dto.inviteCode).toBe('invite-code');
    const errors = validate(dto);

    expect(errors).resolves.toHaveLength(0);
  });

  it('should not validate an invalid payload', () => {
    const payload = {
      invalidPayload: 'invalid',
    };

    const dto = plainToInstance(CourseEditDto, payload);
    expect(dto).toBeDefined();

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(4);
  });
});
