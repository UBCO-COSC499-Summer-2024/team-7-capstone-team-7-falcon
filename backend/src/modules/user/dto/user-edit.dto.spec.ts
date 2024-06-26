import { plainToInstance } from 'class-transformer';
import { UserEditDto } from './user-edit.dto';
import { validate } from 'class-validator';

describe('UserEditDto', () => {
  it('should be defined', () => {
    expect(new UserEditDto()).toBeDefined();
  });

  it('should validate a valid payload', () => {
    const payload: UserEditDto = {
      first_name: 'firstName',
      last_name: 'lastName',
    };

    const dto = plainToInstance(UserEditDto, payload);
    expect(dto).toBeDefined();
    expect(dto.first_name).toBe('firstName');
    expect(dto.last_name).toBe('lastName');

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(0);
  });

  it('should not validate an invalid payload', () => {
    const payload = {
      invalidPayload: 'invalid',
    };

    const dto = plainToInstance(UserEditDto, payload);
    expect(dto).toBeDefined();

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(1);
  });
});
