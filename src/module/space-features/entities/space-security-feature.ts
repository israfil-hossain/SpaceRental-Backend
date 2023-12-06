import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { BaseEntity } from "../../common/entities/base.entity";

export type SpaceSecurityFeatureDocument =
  HydratedDocument<SpaceSecurityFeatureModel>;
export type SpaceSecurityFeatureModelType = Model<SpaceSecurityFeatureModel>;

@Schema({
  toJSON: {
    transform: function (_, ret) {
      delete ret?._id;
    },
    virtuals: true,
    versionKey: false,
  },
})
export class SpaceSecurityFeatureModel extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  name: string;
}

export const SpaceSecurityFeatureSchema = SchemaFactory.createForClass(
  SpaceSecurityFeatureModel,
);
