import { plainToInstance } from 'class-transformer';
import { UpdateSubmissionUserDto } from './update-submission-user.dto';
import { validate } from 'class-validator';

describe('UpdateSubmissionUserDto', () => {
  it('should be defined', () => {
    expect(1).toBeDefined();
  });

  it('should validate a valid payload', () => {
    const payload: UpdateSubmissionUserDto = {
      studentId: 1,
    };

    const dto = plainToInstance(UpdateSubmissionUserDto, payload);
    expect(dto).toBeDefined();
    expect(dto.studentId).toBe(1);
    const errors = validate(dto);

    expect(errors).resolves.toHaveLength(0);
  });

  it('should not validate an invalid payload', () => {
    const payload = {
      studentId: -1,
    };

    const dto = plainToInstance(UpdateSubmissionUserDto, payload);
    expect(dto).toBeDefined();

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(1);
  });
});
