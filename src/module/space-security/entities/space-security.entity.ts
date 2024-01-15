import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { BaseEntity } from "../../common/entities/base.entity";

export type SpaceSecurityDocument = HydratedDocument<SpaceSecurity>;
export type SpaceSecurityType = Model<SpaceSecurity>;

@Schema()
export class SpaceSecurity extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  name: string;
}

export const SpaceSecuritySchema = SchemaFactory.createForClass(SpaceSecurity);
