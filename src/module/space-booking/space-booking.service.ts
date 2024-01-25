import {
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

  async create(
    createSpaceBookingDto: CreateSpaceBookingDto,
    auditUserId: string,
  ) {
    try {
      const bookingSpace = await this.spaceForRentRepository.findById(
        createSpaceBookingDto.space,
      );

      if (!bookingSpace) {
        throw new NotFoundException(
          `Space for booking is not found with ID: ${createSpaceBookingDto.space}`,
        );
      }

      const bookingStartDate = new Date(createSpaceBookingDto.startDate);
      const bookingEndDate = new Date(
        bookingStartDate.getFullYear(),
        bookingStartDate.getMonth() + createSpaceBookingDto.bookingMonths,
        bookingStartDate.getDate(),
      );

      const conflictingBookings = await this.spaceBookingRepository.find({
        space: bookingSpace._id?.toString(),
        endDate: { $gte: bookingStartDate },
        startDate: { $lte: bookingEndDate },
      });

      if (conflictingBookings?.length) {
        throw new ConflictException(
          `The space is unavailable for booking from ${bookingStartDate.toDateString()} to ${bookingEndDate.toDateString()} due to existing bookings.`,
        );
      }

      const bookingPrice =
        bookingSpace.price * createSpaceBookingDto.bookingMonths;
      const platformFee = 0;
      const totalPrice = bookingPrice + platformFee;

      const generatedBookingCode = this.generateBookingCode();
      const bookingStatus = bookingSpace?.requiresApproval
        ? SpaceBookingStatusEnum.Pending
        : SpaceBookingStatusEnum.Approved;

      const result = await this.spaceBookingRepository.create({
        space: bookingSpace._id?.toString(),
        bookingCode: generatedBookingCode,
        startDate: bookingStartDate,
        endDate: bookingEndDate,
        bookingPrice: bookingPrice,
        platformFee: platformFee,
        totalPrice: totalPrice,
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
