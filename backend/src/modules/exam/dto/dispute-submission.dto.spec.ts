import { plainToInstance } from 'class-transformer';
import { DisputeSubmissionDto } from './dispute-submission.dto';
import { validate } from 'class-validator';

describe('DisputeSubmissionDto', () => {
  it('should be defined', () => {
    expect(new DisputeSubmissionDto()).toBeDefined();
  });

  it('should validate a valid payload', () => {
    const payload: DisputeSubmissionDto = {
      description: 'Test Dispute',
    };

    const dto = plainToInstance(DisputeSubmissionDto, payload);
    expect(dto).toBeDefined();
    expect(dto.description).toBe('Test Dispute');

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(0);
  });

  it('should not validate an invalid payload', () => {
    const payload = {
      invalidPayload: 'invalid',
    };

    const dto = plainToInstance(DisputeSubmissionDto, payload);
    expect(dto).toBeDefined();

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(1);
  });
});
