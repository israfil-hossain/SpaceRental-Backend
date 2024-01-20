import { HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Stripe } from "stripe";

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

  async createPaymentLink(
    amount: number = 23232,
    description: string = "test",
  ): Promise<string> {
    try {
      // Create a PaymentIntent using the Stripe API
      const paymentIntent = await this._stripe.paymentIntents.create({
        amount,
        currency: "usd",
        description,
      });

      // Generate a payment link using the PaymentIntent ID
      const paymentLink = `https://your-frontend-app.com/checkout?paymentIntentId=${paymentIntent.id}`;

      return paymentLink;
    } catch (error) {
      console.error("Error creating payment link:", error.message);
      throw new Error("Failed to create payment link");
    }
  }

  async handleStripeWebhook(request: any, response: any): Promise<void> {
    try {
      // Get the Stripe webhook secret from the configuration
      const webhookSecret = this.configService.get<string>(
        "STRIPE_WEBHOOK_SECRET",
      );

      if (!webhookSecret) {
        throw new Error(
          "Stripe webhook secret not found in the configuration.",
        );
      }

      // Validate the webhook signature
      const stripeSignature = request.headers["stripe-signature"] as string;

      const event = this._stripe.webhooks.constructEvent(
        request.body,
        stripeSignature,
        webhookSecret,
      );

      // Handle the Stripe event based on its type
      switch (event.type) {
        case "payment_intent.succeeded":
          // Handle successful payment
          console.log("PaymentIntent succeeded:", event.data.object.id);
          // Update your database or perform any necessary actions
          break;
        case "payment_intent.payment_failed":
          // Handle payment failure
          console.log("PaymentIntent failed:", event.data.object.id);
          // Handle payment failure, update your application logic accordingly
          break;
        // Add more cases for other relevant events
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      // Respond to the webhook to acknowledge receipt
      response.status(HttpStatus.OK).send({ received: true });
    } catch (error) {
      console.error("Error handling Stripe webhook:", error.message);
      response
        .status(HttpStatus.BAD_REQUEST)
        .send({ error: "Webhook processing failed" });
    }
  }
}
