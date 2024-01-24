import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { GenericRepository } from "../common/repository/generic-repository";
import {
  SpaceBooking,
  SpaceBookingDocument,
  SpaceBookingType,
} from "./entities/space-booking.entity";

@Injectable()
export class SpaceBookingRepository extends GenericRepository<SpaceBookingDocument> {
  constructor(
    @InjectModel(SpaceBooking.name)
    private model: SpaceBookingType,
  ) {
    super(model, new Logger(SpaceBookingRepository.name));
  }
}
