import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";
import { PaginationQuery } from "../../common/dto/pagintation-query.dto";

export class ListSpaceBookingQuery extends PaginationQuery {
  @ApiProperty({
    description: "Status of the booking",
    required: false,
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  public readonly BookingStatus?: string;
}

