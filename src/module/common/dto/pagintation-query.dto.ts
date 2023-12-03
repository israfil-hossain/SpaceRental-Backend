import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";

export class PaginationQuery {
  @ApiProperty({
    description: "Page number",
    example: 1,
    required: false,
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  public readonly Page?: number;

  @ApiProperty({
    description: "Number of items per page",
    example: 10,
    required: false,
  })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  public readonly PageSize?: number;
}
