import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { BaseEntity } from "../../common/entities/base.entity";

export type UnloadingMovingDocument = HydratedDocument<UnloadingMoving>;
export type UnloadingMovingType = Model<UnloadingMovingDocument>;

@Schema()
export class UnloadingMoving extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  name: string;
}

export const UnloadingMovingSchema =
  SchemaFactory.createForClass(UnloadingMoving);
