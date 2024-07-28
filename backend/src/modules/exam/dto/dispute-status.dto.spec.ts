import { plainToInstance } from 'class-transformer';
import { DisputeStatusEnum } from '../../../enums/exam-dispute.enum';
import { DisputeStatusDto } from './dispute-status.dto';
import { validate } from 'class-validator';

describe('DisputeStatusDto', () => {
  it('should be defined', () => {
    expect(new DisputeStatusDto()).toBeDefined();
  });

  it('should validate a valid payload', () => {
    const payload: DisputeStatusDto = {
      status: DisputeStatusEnum.CREATED,
    };

    const dto = plainToInstance(DisputeStatusDto, payload);
    expect(dto).toBeDefined();
    expect(dto.status).toBe(DisputeStatusEnum.CREATED);

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(0);
  });

  it('should not validate an invalid payload', () => {
    const payload = {
      invalidPayload: 'invalid',
    };

    const dto = plainToInstance(DisputeStatusDto, payload);
    expect(dto).toBeDefined();

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(1);
  });
});
