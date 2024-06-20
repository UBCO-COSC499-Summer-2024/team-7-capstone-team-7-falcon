import { plainToInstance } from 'class-transformer';
import { PageOptionsDto } from './page-options.dto';
import { validate } from 'class-validator';

describe('PageOptionsDto', () => {
  it('should be defined', () => {
    expect(new PageOptionsDto()).toBeDefined();
  });

  it('should validate a valid page options dto', () => {
    const payload: PageOptionsDto = {
      page: 1,
      take: 10,
      skip: 0,
    };

    const dto = plainToInstance(PageOptionsDto, payload);
    expect(dto).toBeDefined();

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(0);
  });

  it('should not validate an invalid page options dto', () => {
    const payload = {
      page: 0,
      take: 0,
    };

    const dto = plainToInstance(PageOptionsDto, payload);
    expect(dto).toBeDefined();
    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(2);
  });
});
