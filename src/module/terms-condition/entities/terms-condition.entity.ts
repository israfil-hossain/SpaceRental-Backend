import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { BaseEntity } from "../../common/entities/base.entity";

export type TermsConditionDocument = HydratedDocument<TermsCondition>;
export type TermsConditionType = Model<TermsCondition>;

@Schema()
export class TermsCondition extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, required: true })
  checkboxText: string;

  @Prop({ type: String, required: true })
  content: string;
}

export const TermsConditionSchema =
  SchemaFactory.createForClass(TermsCondition);
