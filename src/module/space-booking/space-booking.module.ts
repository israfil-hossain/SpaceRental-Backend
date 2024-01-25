import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SpaceForRentModule } from "../space-for-rent/space-for-rent.module";
import {
  SpaceBooking,
  SpaceBookingSchema,
} from "./entities/space-booking.entity";
import { SpaceBookingController } from "./space-booking.controller";
import { SpaceBookingRepository } from "./space-booking.repository";
import { SpaceBookingService } from "./space-booking.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SpaceBooking.name, schema: SpaceBookingSchema },
    ]),
    SpaceForRentModule,
  ],
  controllers: [SpaceBookingController],
  providers: [SpaceBookingService, SpaceBookingRepository],
  exports: [SpaceBookingRepository],
})
export class SpaceBookingModule {}
