import { plainToInstance } from 'class-transformer';
import { UserCreateDto } from './user-create.dto';
import { validate } from 'class-validator';

describe('UserCreateDto', () => {
  it('should be defined', () => {
    expect(new UserCreateDto()).toBeDefined();
  });

  it('should validate a valid payload', () => {
    const payload: UserCreateDto = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'user.email@email.com',
      password: 'p@ssw0rD',
      confirm_password: 'p@ssw0rD',
    };

    const dto = plainToInstance(UserCreateDto, payload);
    expect(dto).toBeDefined();

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(0);
  });

  it('should not validate an invalid payload', () => {
    const payload = {
      invalidPayload: 'invalid',
    };

    const dto = plainToInstance(UserCreateDto, payload);
    expect(dto).toBeDefined();

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(4);
  });
});
