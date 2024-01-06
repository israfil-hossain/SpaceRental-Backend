import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { BaseEntity } from "../../common/entities/base.entity";

export type SpaceAccessOptionDocument =
  HydratedDocument<SpaceAccessOptionModel>;
export type SpaceAccessOptionModelType = Model<SpaceAccessOptionModel>;

@Schema()
export class SpaceAccessOptionModel extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  name: string;
}

export const SpaceAccessOptionSchema = SchemaFactory.createForClass(
  SpaceAccessOptionModel,
);
