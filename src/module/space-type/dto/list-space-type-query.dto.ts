import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { PaginationQuery } from "../../common/dto/pagintation-query.dto";

export class ListSpaceTypeQuery extends PaginationQuery {
  @ApiProperty({
    description: "Name of the space type",
    example: "Meeting Room",
    required: false,
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  public readonly Name?: string;
}
