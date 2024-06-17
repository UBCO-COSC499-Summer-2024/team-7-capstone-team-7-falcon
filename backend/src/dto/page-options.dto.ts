import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { PageOrder } from '../enums/page-order.enum';
import { Type } from 'class-transformer';
import 'reflect-metadata';

/**
 * Page options dto
 */
export class PageOptionsDto {
  @IsEnum(PageOrder)
  @IsOptional()
  order?: PageOrder = PageOrder.ASC;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  @IsOptional()
  take?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
