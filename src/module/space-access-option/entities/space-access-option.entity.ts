import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { BaseEntity } from "../../common/entities/base.entity";

export type SpaceAccessOptionDocument = HydratedDocument<SpaceAccessOption>;
export type SpaceAccessOptionModelType = Model<SpaceAccessOption>;

@Schema({
  toJSON: {
    transform: function (_, ret) {
      delete ret?._id;
    },
    virtuals: true,
    versionKey: false,
  },
})
export class SpaceAccessOption extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  name: string;
}

export const SpaceAccessOptionSchema =
  SchemaFactory.createForClass(SpaceAccessOption);
