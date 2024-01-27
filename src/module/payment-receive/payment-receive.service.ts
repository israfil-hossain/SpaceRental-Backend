import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  RawBodyRequest,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UpdateQuery } from "mongoose";
import { Stripe } from "stripe";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { SpaceBookingDocument } from "../space-booking/entities/space-booking.entity";
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

      let stripeIntent: Stripe.PaymentIntent;
      let paymentReceive =
        booking?.paymentReceive as unknown as PaymentReceiveDocument;

      if (!paymentReceive) {
        paymentReceive = await this.paymentReceiveRepository.create({
          totalPayable: booking.totalPrice,
          totalDue: booking.totalPrice,
          createdBy: auditUserId,
        });

        stripeIntent = await this.stripeService.paymentIntents.create({
          amount: booking.totalPrice * 100,
          currency: "usd",
          metadata: {
            bookingCode: booking.bookingCode,
            bookingId: booking._id?.toString(),
            paymentReceiveId: paymentReceive._id?.toString(),
          },
        });

        await this.paymentReceiveRepository.updateOneById(paymentReceive.id, {
          paymentIntentId: stripeIntent.id,
          lastPaymentEvent: JSON.stringify(stripeIntent),
          updatedBy: auditUserId,
        });

        await this.spaceBookingRepository.updateOneById(bookingId, {
          paymentReceive: paymentReceive._id?.toString(),
          bookingStatus: SpaceBookingStatusEnum.PaymentInitiated,
          updatedBy: auditUserId,
        });
      } else {
        stripeIntent = await this.stripeService.paymentIntents.retrieve(
          paymentReceive?.paymentIntentId,
        );
      }

      const paymentIntentResponse = new PaymentIntentResponseDto();
      paymentIntentResponse.bookingCode = booking.bookingCode;
      paymentIntentResponse.bookingPrice = paymentReceive.totalPayable;
      paymentIntentResponse.stipeKey = this.stripePublishableKey;
      paymentIntentResponse.stripeSecret = stripeIntent.client_secret || "";
      paymentIntentResponse.status = stripeIntent.status;
      paymentIntentResponse.currency = stripeIntent.currency;

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

      const bookingSpaceUpdates: UpdateQuery<SpaceBookingDocument> = {};
      const paymentReceiveUpdates: UpdateQuery<PaymentReceiveDocument> = {};

      // Handle the Stripe event based on its type
      switch (event.type) {
        case "payment_intent.created":
          bookingSpaceUpdates.bookingStatus =
            SpaceBookingStatusEnum.PaymentCreated;
          break;

        case "payment_intent.succeeded":
          bookingSpaceUpdates.bookingStatus =
            SpaceBookingStatusEnum.PaymentCompleted;

          const amountReceived = event.data?.object?.amount_received ?? 0;
          const totalAmount = event.data?.object?.amount ?? 0;

          if (isNaN(amountReceived) || isNaN(totalAmount)) {
            throw new Error("Invalid amount values in the Stripe event.");
          }

          paymentReceiveUpdates.totalPaid = parseFloat(
            (amountReceived / 100).toFixed(2),
          );
          paymentReceiveUpdates.totalDue = parseFloat(
            ((totalAmount - amountReceived) / 100).toFixed(2),
          );
          break;

        case "payment_intent.payment_failed":
          bookingSpaceUpdates.bookingStatus =
            SpaceBookingStatusEnum.PaymentFailed;
          break;

        default:
          this.logger.log("Unhandled event type: " + event.type);
      }

      await this.paymentReceiveRepository.updateOneById(
        event.data.object?.metadata?.paymentReceiveId,
        {
          ...paymentReceiveUpdates,
          lastPaymentEvent: JSON.stringify(event?.data?.object),
        },
      );

      if (Object.keys(bookingSpaceUpdates).length > 0) {
        await this.spaceBookingRepository.updateOneById(
          event.data.object?.metadata?.bookingId,
          bookingSpaceUpdates,
        );
      }

      return { received: true };
    } catch (error) {
      this.logger.error("Error handling Stripe webhook event:", error);
      throw new BadRequestException("Error in webhook");
    }
  }

  //#region Internal helper methods
  //#endregion
}
