import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { BaseEntity } from "../../common/entities/base.entity";

export type SpaceSecurityFeatureDocument =
  HydratedDocument<SpaceSecurityFeature>;
export type SpaceSecurityFeatureType = Model<SpaceSecurityFeature>;

@Schema()
export class SpaceSecurityFeature extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  name: string;
}

export const SpaceSecurityFeatureSchema =
  SchemaFactory.createForClass(SpaceSecurityFeature);
