import { plainToInstance } from 'class-transformer';
import { TokenDto } from './token.dto';
import { validate } from 'class-validator';

describe('TokenDto', () => {
  it('should be defined', () => {
    expect(new TokenDto()).toBeDefined();
  });

  it('should validate a valid payload', () => {
    const payload: TokenDto = {
      token: 'token',
    };

    const dto = plainToInstance(TokenDto, payload);
    expect(dto).toBeDefined();
    expect(dto.token).toBe('token');

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(0);
  });

  it('should not validate an invalid payload', () => {
    const payload = {
      invalidPayload: 'invalid',
    };

    const dto = plainToInstance(TokenDto, payload);
    expect(dto).toBeDefined();

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(1);
  });
});
