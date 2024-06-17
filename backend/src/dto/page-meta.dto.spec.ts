import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { PageDto } from './page.dto';

describe('PageMetaDto', () => {
  it('should validate a page meta dto', () => {
    const data = [1, 2, 3, 4, 5];
    const meta = {
      page: 1,
      take: 5,
      itemCount: 5,
      pageCount: 1,
      hasPreviousPage: false,
      hasNextPage: false,
    };

    const dto = plainToInstance(PageDto, { data, meta });
    expect(dto).toBeDefined();

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(0);
  });

  it('should not validate an invalid page meta dto', () => {
    const data = [1, 2, 3, 4, 5];
    const meta = {
      page: 1,
      take: 5,
      itemCount: 5,
      pageCount: 1,
      hasPreviousPage: false,
    };

    const dto = plainToInstance(PageDto, { data, meta });
    expect(dto).toBeDefined();

    const errors = validate(dto);
    expect(errors).resolves.toHaveLength(1);
  });
});
