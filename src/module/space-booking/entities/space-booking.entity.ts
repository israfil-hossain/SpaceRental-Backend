import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model, Types } from "mongoose";
import { BaseEntity } from "../../common/entities/base.entity";
import { SpaceForRent } from "../../space-for-rent/entities/space-for-rent.entity";
import { SpaceBookingStatusEnum } from "../enum/space-booking-status.enum";

export type SpaceBookingDocument = HydratedDocument<SpaceBooking>;
export type SpaceBookingType = Model<SpaceBookingDocument>;

@Schema()
export class SpaceBooking extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  bookingCode: string;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop({ type: Number, required: true })
  bookingPrice: number;

  @Prop({ type: Number, default: 0 })
  platformFee: number;

  @Prop({ type: Number, required: true })
  totalPrice: number;

  @Prop({
    type: String,
    enum: Object.values(SpaceBookingStatusEnum),
    default: SpaceBookingStatusEnum.Pending,
  })
  bookingStatus: SpaceBookingStatusEnum;

  @Prop({
    type: Types.ObjectId,
    ref: SpaceForRent.name,
    required: true,
  })
  space: string;
}
export const SpaceBookingSchema = SchemaFactory.createForClass(SpaceBooking);
