import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model, Types } from "mongoose";
import { BaseEntity } from "../../common/entities/base.entity";
import { SpaceBooking } from "../../space-booking/entities/space-booking.entity";
import { CurrencyEnum } from "../enum/currency.enum";

export type PaymentInvoiceDocument = HydratedDocument<PaymentInvoice>;
export type PaymentInvoiceType = Model<PaymentInvoiceDocument>;

@Schema()
export class PaymentInvoice extends BaseEntity {
  @Prop({
    type: Types.ObjectId,
    ref: SpaceBooking.name,
    required: true,
  })
  booking: string;

  @Prop({ type: Number, required: true })
  totalPrice: number;

  @Prop({ type: Number, default: 0 })
  totalPaid: number;

  @Prop({
    type: String,
    enum: Object.values(CurrencyEnum),
    default: CurrencyEnum.USD,
  })
  currency: CurrencyEnum;

  @Prop({ type: String })
  paymentIntentId: string;
}

export const PaymentInvoiceSchema =
  SchemaFactory.createForClass(PaymentInvoice);
