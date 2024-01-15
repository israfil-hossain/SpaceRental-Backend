import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { BaseEntity } from "../../common/entities/base.entity";

export type SpaceScheduleDocument = HydratedDocument<SpaceSchedule>;
export type SpaceScheduleType = Model<SpaceSchedule>;

@Schema()
export class SpaceSchedule extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  name: string;
}

export const SpaceScheduleSchema = SchemaFactory.createForClass(SpaceSchedule);
