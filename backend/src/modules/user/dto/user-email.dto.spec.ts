import { plainToInstance } from 'class-transformer';
import { UserEmailDto } from './user-email.dto';
import { validate } from 'class-validator';

describe('UserEmailDto', () => {
  it('should be defined', () => {
    expect(new UserEmailDto()).toBeDefined();
  });

  it('should validate a valid payload', () => {
    const payload: UserEmailDto = {
      email: 'email@email.com',
    };

    const dto = plainToInstance(UserEmailDto, payload);
    expect(dto).toBeDefined();
    expect(dto.email).toBe('email@email.com');

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(0);
  });

  it('should not validate an invalid payload', () => {
    const payload = {
      invalidPayload: 'invalid',
    };

    const dto = plainToInstance(UserEmailDto, payload);
    expect(dto).toBeDefined();

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(1);
  });
});
