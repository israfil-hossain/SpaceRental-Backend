import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthUserId } from "../authentication/decorator/auth-user-id.decorator";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateSpaceBookingDto } from "./dto/create-space-booking.dto";
import { SpaceBookingService } from "./space-booking.service";

@ApiTags("Space Bookings")
@Controller("SpaceBooking")
export class SpaceBookingController {
  constructor(private readonly spaceBookingService: SpaceBookingService) {}

  @Post("Create")
  @ApiBody({ type: CreateSpaceBookingDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  create(
    @AuthUserId() { userId }: ITokenPayload,
    @Body() createSpaceBookingDto: CreateSpaceBookingDto,
  ) {
    return this.spaceBookingService.create(createSpaceBookingDto, userId);
  }
}
