import { Controller, Get, Param } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthUserId } from "../authentication/decorator/auth-user-id.decorator";
import { DocIdQueryDto } from "../common/dto/doc-id-query.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { PaymentService } from "./payment.service";

@ApiTags("Payments")
@Controller("Payment")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Get("GetIntentByBookingId/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  create(
    @AuthUserId() { userId }: ITokenPayload,
    @Param() { DocId }: DocIdQueryDto,
  ) {
    return this.paymentService.getPaymentIntent(DocId, userId);
  }
}
