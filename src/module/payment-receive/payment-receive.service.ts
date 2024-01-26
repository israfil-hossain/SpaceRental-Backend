import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  RawBodyRequest,
} from "@nestjs/common";
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

  private readonly stripeWebhookSecret: string;
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
    this.stripePublishableKey = this.configService.get<string>(
      "STRIPE_PUBLISHABLE_KEY",
      "",
    );
    this.stripeWebhookSecret = this.configService.get<string>(
      "STRIPE_WEBHOOK_SECRET",
      "",
    );

    this.stripeService = new Stripe(stripeSecretKey, {});
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
          bookingStatus: SpaceBookingStatusEnum.PaymentInitiated,
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

  async handleStripeWebhook(
    request: RawBodyRequest<Request>,
    signature: string,
  ) {
    try {
      if (!this.stripeWebhookSecret) {
        throw new Error(
          "Stripe webhook secret not found in the configuration.",
        );
      }

      // Validate the webhook signature
      const event: any = this.stripeService.webhooks.constructEvent(
        request.rawBody as Buffer,
        signature,
        this.stripeWebhookSecret,
      );

      // Handle the Stripe event based on its type
      switch (event.type) {
        case "payment_intent.created":
        case "payment_intent.succeeded":
        // Handle successful payment
        case "payment_intent.payment_failed":
        // Handle payment failure
        // Add more cases for other relevant events
        default:
        // this.logger.log("Success: " + JSON.stringify(event));
      }

      this.logger.log("meta : " + JSON.stringify(event.data.object?.metadata));

      const bookingCode = event.data.object?.metadata?.bookingCode;
      const booking = await this.spaceBookingRepository.findOneWhere({
        bookingCode: bookingCode,
      });

      if (booking) {
        await this.spaceBookingRepository.updateOneById(booking.id, {
          lastPaymentEvent: JSON.stringify(event),
        });
      }

      return { received: true };
    } catch (error) {
      this.logger.log("Error: " + error);
      throw new BadRequestException("Error in webhook");
    }
  }

  //#region Internal helper methods
  //#endregion
}
