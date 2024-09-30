/* eslint-disable prettier/prettier */
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { GenericRepository } from "../common/repository/generic-repository";
import {
  SpaceBooking,
  SpaceBookingDocument,
  SpaceBookingType,
} from "./entities/space-booking.entity";
import { FilterQuery } from "mongoose";

@Injectable()
export class SpaceBookingRepository extends GenericRepository<SpaceBookingDocument> {
  private readonly logger: Logger;
  constructor(
    @InjectModel(SpaceBooking.name)
    private model: SpaceBookingType,
  ) {
    super(model, new Logger(SpaceBookingRepository.name));
  }

  async findAllBookings(
    filter: FilterQuery<SpaceBookingDocument>,
    skip: number,
    limit: number,
  ): Promise<SpaceBookingDocument[]> {
    try {
      const result = await this.model
        .aggregate()
        .sort({ createdAt: -1 })
        .match(filter)
        .skip(skip)
        .limit(limit)
        .exec();

      return result;
    } catch (error) {
      this.logger.error("Error finding entities:", error);
      return [];
    }
  }
}

