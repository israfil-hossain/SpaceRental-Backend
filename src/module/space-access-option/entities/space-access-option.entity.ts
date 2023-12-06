import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { BaseEntity } from "../../common/entities/base.entity";

export type SpaceAccessOptionDocument =
  HydratedDocument<SpaceAccessOptionModel>;
export type SpaceAccessOptionModelType = Model<SpaceAccessOptionModel>;

@Schema({
  toJSON: {
    transform: function (_, ret) {
      delete ret?._id;
    },
    virtuals: true,
    versionKey: false,
  },
})
export class SpaceAccessOptionModel extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  name: string;
}

export const SpaceAccessOptionSchema = SchemaFactory.createForClass(
  SpaceAccessOptionModel,
);
