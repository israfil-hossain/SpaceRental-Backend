import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsInt, IsMongoId, IsNotEmpty, Min } from "class-validator";

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
    description: "The number of months for the booking.",
    type: Number,
    default: 1,
  })
  @IsInt()
  @Min(1, { message: "Booking should be for at least 1 month." })
  @IsNotEmpty()
  bookingMonths: number;
}
