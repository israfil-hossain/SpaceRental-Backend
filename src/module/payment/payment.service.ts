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

  constructor(
    private readonly configService: ConfigService,
    private readonly paymentInvoiceRepository: PaymentInvoiceRepository,
    private readonly spaceBookingRepository: SpaceBookingRepository,
  ) {
    const stripeSecretKey = this.configService.get<string>("STRIPE_SECRET_KEY");

    if (!stripeSecretKey) {
      throw new Error("Stripe secret key not found in the configuration.");
    }

    this.stripe = new Stripe(stripeSecretKey, {});
  }

  async getPaymentIntent(
    bookingId: string,
    auditUserId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const booking = await this.spaceBookingRepository.findById(bookingId, {
        populate: [{ path: "space", select: "price" }],
      });

      if (!booking) {
        throw new NotFoundException(`Booking with ID ${bookingId} not found.`);
      }

      let paymentIntent: Stripe.PaymentIntent;
      const paymentIntentResponse = new PaymentIntentResponseDto();
      let paymentInvoice = await this.paymentInvoiceRepository.findOneWhere({
        booking: bookingId,
      });

      if (!paymentInvoice) {
        const totalPayable = this.calculateTotalPayable(booking);

        paymentIntent = await this.stripe.paymentIntents.create({
          amount: totalPayable,
          currency: CurrencyEnum.USD,
          metadata: {
            bookingId: booking._id.toString(),
          },
        });

        paymentInvoice = await this.paymentInvoiceRepository.create({
          booking: booking._id?.toString(),
          paymentIntentId: paymentIntent.id,
          totalPrice: totalPayable,
          createdBy: auditUserId,
        });
      } else {
        paymentIntent = await this.stripe.paymentIntents.retrieve(
          paymentInvoice?.paymentIntentId,
        );
      }

      paymentIntentResponse.paymentInvoice =
        paymentInvoice?._id?.toString() || "";
      paymentIntentResponse.clientSecret = paymentIntent.client_secret || "";
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

  private calculateTotalPayable(booking: any): number {
    const bookingSpace = booking.space;
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const diffInMonths =
      (end.getFullYear() - start.getFullYear()) * 12 +
      end.getMonth() -
      start.getMonth();
    return diffInMonths * bookingSpace.price * 100;
  }
}
