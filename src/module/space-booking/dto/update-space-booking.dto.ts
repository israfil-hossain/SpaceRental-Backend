import { PartialType } from "@nestjs/swagger";
import { CreateSpaceBookingDto } from "./create-space-booking.dto";

export class UpdateSpaceBookingDto extends PartialType(CreateSpaceBookingDto) {}
