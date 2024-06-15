import { plainToInstance } from 'class-transformer';
import { CourseCreateDto } from './course-create.dto';
import { validate } from 'class-validator';

describe('CourseCreateDto', () => {
  it('should be defined', () => {
    expect(new CourseCreateDto()).toBeDefined();
  });

  it('should validate a valid payload', () => {
    const payload: CourseCreateDto = {
      course_code: 'Test Course',
      course_name: 'Test Description',
      section_name: 'TEST',
      semester_id: 1,
    };

    const dto = plainToInstance(CourseCreateDto, payload);
    expect(dto).toBeDefined();
    expect(dto.course_code).toBe('Test Course');
    expect(dto.course_name).toBe('Test Description');
    expect(dto.section_name).toBe('TEST');
    expect(dto.semester_id).toBe(1);
    const errors = validate(dto);

    expect(errors).resolves.toHaveLength(0);
  });

  it('should not validate an invalid payload', () => {
    const payload = {
      invalidPayload: 'invalid',
    };

    const dto = plainToInstance(CourseCreateDto, payload);
    expect(dto).toBeDefined();

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(4);
  });
});
