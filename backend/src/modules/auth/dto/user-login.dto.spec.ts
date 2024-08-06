import { plainToInstance } from 'class-transformer';
import { UserLoginDto } from './user-login.dto';
import { validate } from 'class-validator';

describe('UserLoginDto', () => {
  it('should be defined', () => {
    expect(new UserLoginDto()).toBeDefined();
  });

  it('should validate a valid payload', () => {
    const payload: UserLoginDto = {
      email: 'email@email.com',
      password: 'password',
    };

    const dto = plainToInstance(UserLoginDto, payload);
    expect(dto).toBeDefined();

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(0);
  });

  it('should not validate an invalid payload', () => {
    const payload = {
      invalidPayload: 'invalid',
    };

    const dto = plainToInstance(UserLoginDto, payload);
    expect(dto).toBeDefined();

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(2);
  });
});
