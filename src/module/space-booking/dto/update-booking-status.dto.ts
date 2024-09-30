/* eslint-disable prettier/prettier */
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsMongoId, IsNotEmpty, IsString } from "class-validator";
import { SpaceBookingStatusEnum } from "../enum/space-booking-status.enum";

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
    required: true,
    enum: SpaceBookingStatusEnum,
  })
  @IsEnum(SpaceBookingStatusEnum)
  @IsNotEmpty()
  public readonly bookingStatus: SpaceBookingStatusEnum;
}

