import { Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Stripe } from "stripe";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { SpaceBookingRepository } from "../space-booking/space-booking.repository";
import { PaymentIntentResponseDto } from "./dto/payment-intent-response.dto";
import { CurrencyEnum } from "./enum/currency.enum";
import { PaymentInvoiceRepository } from "./payment-invoice.repository";

@Injectable()
export class PaymentService {
  private readonly stripe: Stripe;
  private readonly stripePublishableKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly paymentInvoiceRepository: PaymentInvoiceRepository,
    private readonly spaceBookingRepository: SpaceBookingRepository,
  ) {
    const stripeSecretKey = this.configService.get<string>(
      "STRIPE_SECRET_KEY",
      "",
    );

    this.stripe = new Stripe(stripeSecretKey, {});
    this.stripePublishableKey = this.configService.get<string>(
      "STRIPE_PUBLISHABLE_KEY",
      "",
    );
  }

  async getPaymentIntent(
    bookingId: string,
    auditUserId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const booking = await this.spaceBookingRepository.findById(bookingId);

      if (!booking) {
        throw new NotFoundException(`Booking with ID ${bookingId} not found.`);
      }

      let paymentIntent: Stripe.PaymentIntent;
      const paymentIntentResponse = new PaymentIntentResponseDto();

      let paymentInvoice = await this.paymentInvoiceRepository.findOneWhere({
        booking: bookingId,
      });

      if (!paymentInvoice) {
        paymentIntent = await this.stripe.paymentIntents.create({
          amount: booking.totalPrice * 100,
          currency: CurrencyEnum.USD,
          metadata: {
            bookingCode: booking.bookingCode,
          },
        });

        paymentInvoice = await this.paymentInvoiceRepository.create({
          booking: booking._id?.toString(),
          paymentIntentId: paymentIntent.id,
          totalPayable: booking.totalPrice,
          totalDue: booking.totalPrice,
          createdBy: auditUserId,
        });
      } else {
        paymentIntent = await this.stripe.paymentIntents.retrieve(
          paymentInvoice?.paymentIntentId,
        );
      }

      paymentIntentResponse.stipeKey = this.stripePublishableKey;
      paymentIntentResponse.clientSecret = paymentIntent.client_secret || "";
      paymentIntentResponse.bookingCode = booking.bookingCode;
      paymentIntentResponse.status = paymentIntent.status;
      paymentIntentResponse.amount = paymentIntent.amount;
      paymentIntentResponse.currency = paymentIntent.currency;

      return new SuccessResponseDto(
        "Payment intent retrieved successfully",
        paymentIntentResponse,
      );
    } catch (error) {
      console.error("Error in getPaymentIntent:", error);
      throw new Error("Failed to get payment intent");
    }
  }
}
