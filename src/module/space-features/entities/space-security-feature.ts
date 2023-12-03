import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { BaseEntity } from "../../common/entities/base.entity";

export type SpaceSecurityFeatureDocument =
  HydratedDocument<SpaceSecurityFeature>;
export type SpaceSecurityFeatureModelType = Model<SpaceSecurityFeature>;

@Schema({
  toJSON: {
    transform: function (_, ret) {
      delete ret?._id;
    },
    virtuals: true,
    versionKey: false,
  },
})
export class SpaceSecurityFeature extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  name: string;
}

export const SpaceSecurityFeatureSchema =
  SchemaFactory.createForClass(SpaceSecurityFeature);
