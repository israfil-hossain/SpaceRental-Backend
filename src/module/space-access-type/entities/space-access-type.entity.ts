import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { BaseEntity } from "../../common/entities/base.entity";

export type SpaceAccessTypeDocument = HydratedDocument<SpaceAccessType>;
export type SpaceAccessTypeType = Model<SpaceAccessType>;

@Schema()
export class SpaceAccessType extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  name: string;
}

export const SpaceAccessTypeSchema =
  SchemaFactory.createForClass(SpaceAccessType);
