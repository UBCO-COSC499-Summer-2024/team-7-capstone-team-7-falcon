import { plainToInstance } from 'class-transformer';
import { UserPasswordResetDto } from './user-password-reset.dto';
import { validate } from 'class-validator';

describe('UserPasswordResetDto', () => {
  it('should be defined', () => {
    expect(new UserPasswordResetDto()).toBeDefined();
  });

  it('should validate a valid payload', () => {
    const payload: UserPasswordResetDto = {
      password: 'p@ssworD2',
      confirm_password: 'p@ssworD2',
      token: 'token',
    };

    const dto = plainToInstance(UserPasswordResetDto, payload);
    expect(dto).toBeDefined();
    expect(dto.password).toBe('p@ssworD2');
    expect(dto.confirm_password).toBe('p@ssworD2');
    expect(dto.token).toBe('token');

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(0);
  });

  it('should not validate an invalid payload', () => {
    const payload = {
      invalidPayload: 'invalid',
    };

    const dto = plainToInstance(UserPasswordResetDto, payload);
    expect(dto).toBeDefined();

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(3);
  });
});
