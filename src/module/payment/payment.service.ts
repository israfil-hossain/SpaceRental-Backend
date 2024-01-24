import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Stripe } from "stripe";
import { CurrencyEnum } from "./enum/currency.enum";

@Injectable()
export class PaymentService {
  private readonly _stripe: Stripe;

  constructor(private readonly configService: ConfigService) {
    const stripeSecretKey = this.configService.get<string>("STRIPE_SECRET_KEY");

    if (!stripeSecretKey) {
      throw new Error("Stripe secret key not found in the configuration.");
    }

    this._stripe = new Stripe(stripeSecretKey, {});
  }

  async createPaymentLink(bookingId: string): Promise<string> {
    try {
      // Create a PaymentIntent using the Stripe API
      const paymentIntent = await this._stripe.paymentIntents.create({
        amount: 1323,
        currency: CurrencyEnum.USD,
        description: bookingId,
      });

      // Generate a payment link using the PaymentIntent ID
      const paymentLink = `https://your-frontend-app.com/checkout?paymentIntentId=${paymentIntent.client_secret}`;

      return paymentLink;
    } catch (error) {
      console.error("Error creating payment link:", error);
      throw new Error("Failed to create payment link. Please try again later.");
    }
  }
}
