import { Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { PaginationQuery } from "../../common/dto/pagintation-query.dto";

export class ListSpaceTypeQuery extends PaginationQuery {
  @Type(() => String)
  @IsString()
  @IsOptional()
  public readonly Name?: string;
}
