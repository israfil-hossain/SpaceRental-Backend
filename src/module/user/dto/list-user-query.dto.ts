import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { PaginationQuery } from "../../common/dto/pagintation-query.dto";

export class ListUserQuery extends PaginationQuery {
  @ApiProperty({
    description: "Email of the user",
    example: "user@example.com",
    required: false,
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  public readonly Email?: string;

  @ApiProperty({
    description: "Name of the user",
    example: "John Doe",
    required: false,
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  public readonly Name?: string;
}
