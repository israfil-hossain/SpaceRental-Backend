import { Controller, Post, Query } from "@nestjs/common";
import { GetPaymentIntentDto } from "./dto/get-payment-intent.dto";
import { PaymentService } from "./payment.service";

@Controller("payment")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create(@Query() { BookingId }: GetPaymentIntentDto) {
    return this.paymentService.createPaymentLink(BookingId);
  }
}
