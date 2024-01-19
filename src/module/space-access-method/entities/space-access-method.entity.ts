import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { BaseEntity } from "../../common/entities/base.entity";

export type SpaceAccessMethodDocument = HydratedDocument<SpaceAccessMethod>;
export type SpaceAccessMethodType = Model<SpaceAccessMethodDocument>;

@Schema()
export class SpaceAccessMethod extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  name: string;
}

export const SpaceAccessMethodSchema =
  SchemaFactory.createForClass(SpaceAccessMethod);
