import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty } from "class-validator";

export class GetPaymentIntentDto {
  @ApiProperty({
    required: true,
    description: "Booking ID for payment",
  })
  @IsNotEmpty({ message: "Booking ID is required" })
  @IsMongoId({ message: "Invalid Booking ID" })
  BookingId: string;
}
