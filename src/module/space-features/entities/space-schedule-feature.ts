import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { BaseEntity } from "../../common/entities/base.entity";

export type SpaceScheduleFeatureDocument =
  HydratedDocument<SpaceScheduleFeature>;
export type SpaceScheduleFeatureModelType = Model<SpaceScheduleFeature>;

@Schema({
  toJSON: {
    transform: function (_, ret) {
      delete ret?._id;
    },
    virtuals: true,
    versionKey: false,
  },
})
export class SpaceScheduleFeature extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  name: string;
}

export const SpaceScheduleFeatureSchema =
  SchemaFactory.createForClass(SpaceScheduleFeature);
