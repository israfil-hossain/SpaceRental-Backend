import { Injectable } from "@nestjs/common";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateSpaceBookingDto } from "./dto/create-space-booking.dto";
import { SpaceBookingRepository } from "./space-booking.repository";

@Injectable()
export class SpaceBookingService {
  constructor(
    private readonly spaceBookingRepository: SpaceBookingRepository,
  ) {}

  async create(
    createSpaceBookingDto: CreateSpaceBookingDto,
    auditUserId: string,
  ) {
    try {
      const result = await this.spaceBookingRepository.create({
        ...createSpaceBookingDto,
        createdBy: auditUserId,
      });

      return new SuccessResponseDto("New Booking created successfully", result);
    } catch (error) {}
  }
}
