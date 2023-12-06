import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { BaseEntity } from "../../common/entities/base.entity";

export type StorageConditionFeatureDocument =
  HydratedDocument<StorageConditionFeatureModel>;
export type StorageConditionFeatureModelType =
  Model<StorageConditionFeatureModel>;

@Schema({
  toJSON: {
    transform: function (_, ret) {
      delete ret?._id;
    },
    virtuals: true,
    versionKey: false,
  },
})
export class StorageConditionFeatureModel extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  name: string;
}

export const StorageConditionFeatureSchema = SchemaFactory.createForClass(
  StorageConditionFeatureModel,
);
