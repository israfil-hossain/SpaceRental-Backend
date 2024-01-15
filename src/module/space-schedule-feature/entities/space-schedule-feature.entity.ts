import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { BaseEntity } from "../../common/entities/base.entity";

export type SpaceScheduleFeatureDocument =
  HydratedDocument<SpaceScheduleFeature>;
export type SpaceScheduleFeatureType = Model<SpaceScheduleFeature>;

@Schema()
export class SpaceScheduleFeature extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  name: string;
}

export const SpaceScheduleFeatureSchema =
  SchemaFactory.createForClass(SpaceScheduleFeature);
