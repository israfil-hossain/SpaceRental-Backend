import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Stripe } from "stripe";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { SpaceBookingStatusEnum } from "../space-booking/enum/space-booking-status.enum";
import { SpaceBookingRepository } from "../space-booking/space-booking.repository";
import { PaymentIntentResponseDto } from "./dto/payment-intent-response.dto";
import { PaymentReceiveDocument } from "./entities/payment-receive.entity";
import { PaymentReceiveRepository } from "./payment-receive.repository";

@Injectable()
export class PaymentReceiveService {
  private readonly logger: Logger = new Logger(PaymentReceiveService.name);
  private readonly stripeService: Stripe;
  private readonly stripePublishableKey: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly paymentReceiveRepository: PaymentReceiveRepository,
    private readonly spaceBookingRepository: SpaceBookingRepository,
  ) {
    const stripeSecretKey = this.configService.get<string>(
      "STRIPE_SECRET_KEY",
      "",
    );

    this.stripeService = new Stripe(stripeSecretKey, {});
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
      const booking = await this.spaceBookingRepository.findById(bookingId, {
        populate: "paymentReceive",
      });

      if (!booking) {
        this.logger.error(
          `Booking with ID ${bookingId} requested by ${auditUserId} was not found.`,
        );
        throw new NotFoundException(`Booking with ID ${bookingId} not found.`);
      }

      let paymentIntent: Stripe.PaymentIntent;
      let paymentReceive =
        booking?.paymentReceive as unknown as PaymentReceiveDocument;

      if (!paymentReceive) {
        paymentIntent = await this.stripeService.paymentIntents.create({
          amount: booking.totalPrice * 100,
          currency: "usd",
          metadata: {
            bookingCode: booking.bookingCode,
          },
        });

        paymentReceive = await this.paymentReceiveRepository.create({
          paymentIntentId: paymentIntent.id,
          totalPayable: booking.totalPrice,
          totalDue: booking.totalPrice,
          createdBy: auditUserId,
        });

        await this.spaceBookingRepository.updateOneById(bookingId, {
          paymentReceive: paymentReceive._id?.toString(),
          bookingStatus: SpaceBookingStatusEnum.Confirmed,
        });
      } else {
        paymentIntent = await this.stripeService.paymentIntents.retrieve(
          paymentReceive?.paymentIntentId,
        );
      }

      const paymentIntentResponse = new PaymentIntentResponseDto();
      paymentIntentResponse.bookingCode = booking.bookingCode;
      paymentIntentResponse.bookingPrice = paymentReceive.totalPayable;
      paymentIntentResponse.stipeKey = this.stripePublishableKey;
      paymentIntentResponse.stripeSecret = paymentIntent.client_secret || "";
      paymentIntentResponse.status = paymentIntent.status;
      paymentIntentResponse.currency = paymentIntent.currency;

      return new SuccessResponseDto(
        "Payment intent retrieved successfully",
        paymentIntentResponse,
      );
    } catch (error) {
      this.logger.error("Error in getPaymentIntent:", error);
      throw new Error("Failed to get payment intent");
    }
  }

  //#region Internal helper methods
  //#endregion
}
