import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { SpaceForRentRepository } from "../space-for-rent/space-for-rent.repository";
import { CreateSpaceBookingDto } from "./dto/create-space-booking.dto";
import { SpaceBookingStatusEnum } from "./enum/space-booking-status.enum";
import { SpaceBookingRepository } from "./space-booking.repository";

@Injectable()
export class SpaceBookingService {
  constructor(
    private readonly spaceBookingRepository: SpaceBookingRepository,
    private readonly spaceForRentRepository: SpaceForRentRepository,
  ) {}

  async create(createDto: CreateSpaceBookingDto, auditUserId: string) {
    try {
      const bookingSpace = await this.spaceForRentRepository.findById(
        createDto.space,
      );

      if (!bookingSpace) {
        throw new NotFoundException(
          `Space for booking is not found with ID: ${createDto.space}`,
        );
      }

      const bookingStartDate = new Date(createDto.fromDate);
      const bookingEndDate = new Date(createDto.toDate);

      if (bookingStartDate > bookingEndDate) {
        throw new BadRequestException(
          "Invalid date range: fromDate should be before toDate.",
        );
      }

      bookingStartDate.setHours(0, 0, 0, 0);
      bookingEndDate.setHours(23, 59, 59, 999);

      const totalBookingTime =
        bookingEndDate.getTime() - bookingStartDate.getTime();
      const totalBookingDays = Math.ceil(
        Math.abs(totalBookingTime) / (1000 * 60 * 60 * 24),
      );

      if (bookingSpace.minimumBookingDays > totalBookingDays) {
        throw new ConflictException(
          `Booking should be for at least ${bookingSpace.minimumBookingDays} days.`,
        );
      }

      const conflictingBookings = await this.spaceBookingRepository.find(
        {
          space: bookingSpace._id?.toString(),
          fromDate: { $lte: bookingEndDate },
          toDate: { $gte: bookingStartDate },
        },
        {
          hint: {
            space: 1,
            fromDate: 1,
            toDate: 1,
          },
        },
      );

      if (conflictingBookings?.length) {
        throw new ConflictException(
          `The space is unavailable for booking from ${bookingStartDate.toDateString()} to ${bookingEndDate.toDateString()} due to existing bookings.`,
        );
      }

      const bookingPricePerDay = bookingSpace.pricePerMonth / 30;
      const bookingPrice = bookingPricePerDay * totalBookingDays;
      const platformFee = 0;
      const totalPrice = bookingPrice + platformFee;

      const generatedBookingCode = this.generateBookingCode();
      const bookingStatus = bookingSpace?.requiresApproval
        ? SpaceBookingStatusEnum.Pending
        : SpaceBookingStatusEnum.Approved;

      const result = await this.spaceBookingRepository.create({
        space: bookingSpace._id?.toString(),
        bookingCode: generatedBookingCode,
        fromDate: bookingStartDate,
        toDate: bookingEndDate,
        bookingPrice: bookingPrice,
        platformFee: platformFee,
        totalPrice: parseFloat(totalPrice.toFixed(2)),
        bookingStatus: bookingStatus,
        createdBy: auditUserId,
      });

      return new SuccessResponseDto("New Booking created successfully", result);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException("Something went wrong");
    }
  }

  private generateBookingCode() {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");
    const milliseconds = currentDate
      .getTime()
      .toString()
      .slice(-4)
      .padStart(4, "0");

    const randomCode = (Math.floor(Math.random() * 90000) + 10000).toString();

    const bookingCode = `SRB${year}${month}${day}${milliseconds}${randomCode}`;

    return bookingCode;
  }
}
