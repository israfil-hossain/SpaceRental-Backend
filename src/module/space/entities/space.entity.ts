import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model, Types } from "mongoose";
import { BaseEntity } from "../../common/entities/base.entity";
import { SpaceAccessOption } from "../../space-access-option/entities/space-access-option.entity";
import { SpaceScheduleFeature } from "../../space-features/entities/space-schedule-feature";
import { SpaceSecurityFeature } from "../../space-features/entities/space-security-feature";
import { StorageConditionFeature } from "../../space-features/entities/storage-condition-feature";
import { UnloadingMovingFeature } from "../../space-features/entities/unloading-moving-feature";
import { SpaceType } from "../../space-type/entities/space-type.entity";

export type SpaceDocument = HydratedDocument<SpaceModel>;
export type SpaceModelType = Model<SpaceModel>;

@Schema({
  toJSON: {
    transform: function (_, ret) {
      delete ret?._id;
    },
    virtuals: true,
    versionKey: false,
  },
})
export class SpaceModel extends BaseEntity {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  location: string;

  @Prop({ type: Number, required: true })
  area: number;

  @Prop({ type: Number, required: true })
  height: number;

  @Prop({ type: Number, required: true })
  price: number;

  @Prop({ type: String, required: true })
  minimumPeriod: string;

  @Prop({
    type: Types.ObjectId,
    ref: SpaceType.name,
    required: true,
  })
  type: SpaceType;

  @Prop({
    type: Types.ObjectId,
    ref: SpaceAccessOption.name,
    required: true,
  })
  accessMethod: SpaceAccessOption;

  @Prop({
    type: [Types.ObjectId],
    ref: StorageConditionFeature.name,
    required: true,
  })
  storageConditions: StorageConditionFeature[];

  @Prop({
    type: [Types.ObjectId],
    ref: UnloadingMovingFeature.name,
    required: true,
  })
  unloadingMovings: UnloadingMovingFeature[];

  @Prop({
    type: [Types.ObjectId],
    ref: SpaceSecurityFeature.name,
    required: true,
  })
  spaceSecurities: SpaceSecurityFeature[];

  @Prop({
    type: [Types.ObjectId],
    ref: SpaceScheduleFeature.name,
    required: true,
  })
  spaceSchedules: SpaceScheduleFeature[];
}

export const SpaceSchema = SchemaFactory.createForClass(SpaceModel);
