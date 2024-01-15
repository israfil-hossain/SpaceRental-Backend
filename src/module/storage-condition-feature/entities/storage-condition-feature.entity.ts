import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { BaseEntity } from "../../common/entities/base.entity";

export type StorageConditionFeatureDocument =
  HydratedDocument<StorageConditionFeature>;
export type StorageConditionFeatureType = Model<StorageConditionFeature>;

@Schema()
export class StorageConditionFeature extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  name: string;
}

export const StorageConditionFeatureSchema = SchemaFactory.createForClass(
  StorageConditionFeature,
);
