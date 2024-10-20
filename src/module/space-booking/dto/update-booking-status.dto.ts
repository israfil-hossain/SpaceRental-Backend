/* eslint-disable prettier/prettier */
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { SpaceBookingStatusDtoEnum } from "../enum/space-booking-status.enum";

export class UpdateBookingStatusDto {
  @ApiProperty({
    description: "Booking ID of the booking",
    required: true,
  })
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  public readonly bookingId: string;

  @ApiProperty({
    description: "Status of the booking",
    enum: SpaceBookingStatusDtoEnum,
    required: true,
  })
  @IsNotEmpty()
  public readonly bookingStatus: SpaceBookingStatusDtoEnum;
}

