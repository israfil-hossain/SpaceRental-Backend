import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { BaseEntity } from "../../common/entities/base.entity";

export type StorageConditionDocument = HydratedDocument<StorageCondition>;
export type StorageConditionType = Model<StorageConditionDocument>;

@Schema()
export class StorageCondition extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  name: string;
}

export const StorageConditionSchema =
  SchemaFactory.createForClass(StorageCondition);
