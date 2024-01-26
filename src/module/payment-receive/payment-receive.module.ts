import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SpaceBookingModule } from "../space-booking/space-booking.module";
import {
  PaymentReceive,
  PaymentReceiveSchema,
} from "./entities/payment-receive.entity";
import { PaymentReceiveController } from "./payment-receive.controller";
import { PaymentReceiveRepository } from "./payment-receive.repository";
import { PaymentReceiveService } from "./payment-receive.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentReceive.name, schema: PaymentReceiveSchema },
    ]),
    SpaceBookingModule,
  ],
  controllers: [PaymentReceiveController],
  providers: [PaymentReceiveService, PaymentReceiveRepository],
})
export class PaymentReceiveModule {}
