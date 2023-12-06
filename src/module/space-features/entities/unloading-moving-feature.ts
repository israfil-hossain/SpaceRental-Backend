import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { BaseEntity } from "../../common/entities/base.entity";

export type UnloadingMovingFeatureDocument =
  HydratedDocument<UnloadingMovingFeatureModel>;
export type UnloadingMovingFeatureModelType =
  Model<UnloadingMovingFeatureModel>;

@Schema({
  toJSON: {
    transform: function (_, ret) {
      delete ret?._id;
    },
    virtuals: true,
    versionKey: false,
  },
})
export class UnloadingMovingFeatureModel extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  name: string;
}

export const UnloadingMovingFeatureSchema = SchemaFactory.createForClass(
  UnloadingMovingFeatureModel,
);
