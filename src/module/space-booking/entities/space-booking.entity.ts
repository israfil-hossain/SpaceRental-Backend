import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model, Types } from "mongoose";
import { SpaceForRent } from "../../space-for-rent/entities/space-for-rent.entity";
import { BaseEntity } from "../../common/entities/base.entity";

export type SpaceBookingDocument = HydratedDocument<SpaceBooking>;
export type SpaceBookingType = Model<SpaceBookingDocument>;

@Schema()
export class SpaceBooking extends BaseEntity {
  @Prop({
    type: Types.ObjectId,
    ref: SpaceForRent.name,
    required: true,
  })
  space: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;
}
export const SpaceBookingSchema = SchemaFactory.createForClass(SpaceBooking);
