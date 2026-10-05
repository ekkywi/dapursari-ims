import { IsDateString, IsOptional, IsString } from 'class-validator';

export class QueryStockInDto {
  @IsOptional()
  @IsString()
  supplierId?: string;

  @IsOptional()
  @IsString()
  itemId?: string;

  /** Inclusive, ISO 8601. */
  @IsOptional()
  @IsDateString()
  startDate?: string;

  /** Inclusive; a date-only value ("2026-10-06") covers the whole day. */
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
