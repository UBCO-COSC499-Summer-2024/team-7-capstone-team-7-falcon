import { plainToInstance } from 'class-transformer';
import { UserRoleDto } from './user-role.dto';
import { UserRoleEnum } from '../../../enums/user.enum';
import { validate } from 'class-validator';

describe('UserRoleDto', () => {
  it('should be defined', () => {
    expect(new UserRoleDto()).toBeDefined();
  });

  it('should validate a valid payload', () => {
    const payload: UserRoleDto = {
      userRole: UserRoleEnum.ADMIN,
    };

    const dto = plainToInstance(UserRoleDto, payload);
    expect(dto).toBeDefined();
    expect(dto.userRole).toBe('admin');

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(0);
  });

  it('should not validate an invalid payload', () => {
    const payload = {};

    const dto = plainToInstance(UserRoleDto, payload);
    expect(dto).toBeDefined();

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(1);
  });
});
