import { plainToInstance } from 'class-transformer';
import { PageDto } from './page.dto';
import { validate } from 'class-validator';

describe('PageDto', () => {
  it('should validate a page dto', () => {
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
});
