import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { BaseEntity } from "../../common/entities/base.entity";

export type UnloadingMovingFeatureDocument =
  HydratedDocument<UnloadingMovingFeature>;
export type UnloadingMovingFeatureModelType = Model<UnloadingMovingFeature>;

@Schema({
  toJSON: {
    transform: function (_, ret) {
      delete ret?._id;
    },
    virtuals: true,
    versionKey: false,
  },
})
export class UnloadingMovingFeature extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  name: string;
}

export const UnloadingMovingFeatureSchema = SchemaFactory.createForClass(
  UnloadingMovingFeature,
);
