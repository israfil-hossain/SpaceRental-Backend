import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SpaceBookingModule } from "../space-booking/space-booking.module";
import {
  PaymentInvoice,
  PaymentInvoiceSchema,
} from "./entities/payment-invoice.entity";
import { PaymentInvoiceRepository } from "./payment-invoice.repository";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentInvoice.name, schema: PaymentInvoiceSchema },
    ]),
    SpaceBookingModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentInvoiceRepository],
})
export class PaymentModule {}
