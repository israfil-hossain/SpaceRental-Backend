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
        createDto.spaceId,
      );

      if (!bookingSpace) {
        throw new NotFoundException(
          `Space for booking is not found with ID: ${createDto.spaceId}`,
        );
      }

      const bookingStartDate = new Date(createDto.fromDate);
      const bookingEndDate = new Date(createDto.toDate);

      if (bookingStartDate >= bookingEndDate) {
        throw new BadRequestException(
          "Invalid date range: The start date (fromDate) should be before the end date (toDate)",
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
        throw new BadRequestException(
          `The booking duration must be at least ${bookingSpace.minimumBookingDays} days for this space.`,
        );
      }

      const conflictingBookings = await this.spaceBookingRepository.find({
        space: bookingSpace._id?.toString(),
        fromDate: { $lte: bookingEndDate },
        toDate: { $gte: bookingStartDate },
        bookingStatus: {
          $in: [
            SpaceBookingStatusEnum.Confirmed,
            SpaceBookingStatusEnum.Completed,
          ],
        },
      });

      if (conflictingBookings?.length > 0) {
        const conflictDateRanges = conflictingBookings
          .map(
            (booking) =>
              `${booking.fromDate.toDateString()} to ${booking.toDate.toDateString()}`,
          )
          .join(", ");

        throw new ConflictException(
          `The selected space is already booked between ${bookingStartDate.toDateString()} and ${bookingEndDate.toDateString()}. Booked date ranges: ${conflictDateRanges}. Please choose different dates.`,
        );
      }

      const bookingPricePerDay = bookingSpace.pricePerMonth / 30;
      const bookingPrice = parseFloat(
        (bookingPricePerDay * totalBookingDays).toFixed(2),
      );
      const platformFee = 0; // TODO: You may replace this with the actual platform fee calculation
      const totalPrice = parseFloat((bookingPrice + platformFee).toFixed(2));

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

  private generateBookingCode = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    const milliseconds = date.getMilliseconds().toString().padStart(4, "0");
    const randomCode = Math.random().toString(36).toUpperCase().slice(2, 7);
    return `SRB${year}${month}${day}${hour}${minutes}${seconds}${milliseconds}${randomCode}`;
  };
}
