import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { BaseEntity } from "../../common/entities/base.entity";

export type SpaceSecurityFeatureDocument =
  HydratedDocument<SpaceSecurityFeatureModel>;
export type SpaceSecurityFeatureModelType = Model<SpaceSecurityFeatureModel>;

@Schema()
export class SpaceSecurityFeatureModel extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  name: string;
}

export const SpaceSecurityFeatureSchema = SchemaFactory.createForClass(
  SpaceSecurityFeatureModel,
);
