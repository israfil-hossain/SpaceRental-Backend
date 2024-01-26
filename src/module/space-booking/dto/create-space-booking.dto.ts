import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsMongoId, IsNotEmpty } from "class-validator";

export class CreateSpaceBookingDto {
  @ApiProperty({
    description: "The ID of the space to be booked.",
    type: String,
  })
  @IsMongoId()
  @IsNotEmpty()
  spaceId: string;

  @ApiProperty({
    description: "The from date of the booking.",
    type: Date,
  })
  @IsDate()
  @IsNotEmpty()
  fromDate: Date;

  @ApiProperty({
    description: "The to date of the booking.",
    type: Date,
  })
  @IsDate()
  @IsNotEmpty()
  toDate: Date;
}
