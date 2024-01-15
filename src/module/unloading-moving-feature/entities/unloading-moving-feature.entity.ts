import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { BaseEntity } from "../../common/entities/base.entity";

export type UnloadingMovingFeatureDocument =
  HydratedDocument<UnloadingMovingFeature>;
export type UnloadingMovingFeatureType = Model<UnloadingMovingFeature>;

@Schema()
export class UnloadingMovingFeature extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  name: string;
}

export const UnloadingMovingFeatureSchema = SchemaFactory.createForClass(
  UnloadingMovingFeature,
);
