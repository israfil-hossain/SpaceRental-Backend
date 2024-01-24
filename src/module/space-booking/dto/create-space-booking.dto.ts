import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsMongoId, IsNotEmpty } from "class-validator";

export class CreateSpaceBookingDto {
  @ApiProperty({
    description: "The ID of the space to be booked.",
    type: String,
  })
  @IsMongoId()
  @IsNotEmpty()
  space: string;

  @ApiProperty({
    description: "The start date of the booking.",
    type: Date,
  })
  @IsDate()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty({
    description: "The end date of the booking.",
    type: Date,
  })
  @IsDate()
  @IsNotEmpty()
  endDate: Date;
}
