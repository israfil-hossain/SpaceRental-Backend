import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class PaginationQuery {
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  public readonly Page?: number;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  public readonly PageSize?: number;
}
