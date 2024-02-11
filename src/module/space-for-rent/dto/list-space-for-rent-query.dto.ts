import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsMongoId, IsOptional, IsString } from "class-validator";
import { PaginationQuery } from "../../common/dto/pagintation-query.dto";

export class ListSpaceForRentQuery extends PaginationQuery {
  @ApiProperty({
    description: "Name of the space",
    required: false,
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  public readonly Name?: string;

  @ApiProperty({
    description: "The Id of Space Type",
    required: false,
  })
  @IsMongoId({ message: "Invalid space type" })
  @IsOptional()
  public readonly SpaceType?: string;
}
