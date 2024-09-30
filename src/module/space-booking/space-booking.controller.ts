/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Patch, Post, Query } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthUserId } from "../authentication/decorator/auth-user-id.decorator";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateSpaceBookingDto } from "./dto/create-space-booking.dto";
import { SpaceBookingService } from "./space-booking.service";
import { PaginatedResponseDto } from "../common/dto/paginated-response.dto";
import { ListSpaceBookingQuery } from "./dto/list-space-booking-query.dto";
import { UpdateBookingStatusDto } from "./dto/update-booking-status.dto";
import { RequiredRoles } from "../application-user/decorator/roles.decorator";
import { ApplicationUserRoleEnum } from "../application-user/enum/application-user-role.enum";

@ApiTags("Space - Bookings")
@Controller("SpaceBooking")
export class SpaceBookingController {
  constructor(private readonly spaceBookingService: SpaceBookingService) {}

  @Post("Book")
  @ApiBody({ type: CreateSpaceBookingDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  newBooking(
    @AuthUserId() { userId }: ITokenPayload,
    @Body() createSpaceBookingDto: CreateSpaceBookingDto,
  ) {
    return this.spaceBookingService.createNewBooking(
      createSpaceBookingDto,
      userId,
    );
  }

  @Get("GetAll")
  @ApiResponse({
    status: 200,
    type: PaginatedResponseDto,
  })
  async findAll(@Query() listBookingQuery: ListSpaceBookingQuery) {
    return this.spaceBookingService.findAll(listBookingQuery);
  }

  @Patch("UpdateBookingStatus")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  @RequiredRoles([ApplicationUserRoleEnum.OWNER])
  async updateBookingStatus(
    @Body() updateBookingStatusDto: UpdateBookingStatusDto,
    @AuthUserId() { userId }: ITokenPayload,
  ) {
    return this.spaceBookingService.updateBookingStatus(
      updateBookingStatusDto,
      userId,
    );
  }
}

