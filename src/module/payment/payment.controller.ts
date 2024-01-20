import {
  Body,
  Controller,
  Post,
  RawBodyRequest,
  Req,
  Res,
} from "@nestjs/common";
import { ApiConsumes } from "@nestjs/swagger";
import { IsPublic } from "../authentication/guard/authentication.guard";
import { PaymentService } from "./payment.service";

@Controller("payment")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  create() {
    return this.paymentService.createPaymentLink();
  }

  @Post("webhook")
  @IsPublic()
  @ApiConsumes("text/plain")
  async handleStripeWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Body() payload: string,
    @Res() res: Response,
  ): Promise<void> {
    console.log(req.rawBody);
    console.log(payload);

    await this.paymentService.handleStripeWebhook(req.rawBody, res);
  }
}
