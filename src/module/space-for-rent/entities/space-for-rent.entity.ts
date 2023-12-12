import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model, Types } from "mongoose";
import { BaseEntity } from "../../common/entities/base.entity";
import { ImageModel } from "../../image/entities/image.entity";
import { SpaceAccessOptionModel } from "../../space-access-option/entities/space-access-option.entity";
import { SpaceScheduleFeatureModel } from "../../space-features/entities/space-schedule-feature";
import { SpaceSecurityFeatureModel } from "../../space-features/entities/space-security-feature";
import { StorageConditionFeatureModel } from "../../space-features/entities/storage-condition-feature";
import { UnloadingMovingFeatureModel } from "../../space-features/entities/unloading-moving-feature";
import { SpaceTypeModel } from "../../space-type/entities/space-type.entity";

export type SpaceForRentDocument = HydratedDocument<SpaceForRentModel>;
export type SpaceForRentModelType = Model<SpaceForRentModel>;

@Schema({
  toJSON: {
    transform: function (_, ret) {
      delete ret?._id;
    },
    virtuals: true,
    versionKey: false,
  },
})
export class SpaceForRentModel extends BaseEntity {
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
    ref: SpaceTypeModel.name,
    required: true,
  })
  type: SpaceTypeModel;

  @Prop({
    type: Types.ObjectId,
    ref: SpaceAccessOptionModel.name,
    required: true,
  })
  accessMethod: SpaceAccessOptionModel;

  @Prop({
    type: [Types.ObjectId],
    ref: StorageConditionFeatureModel.name,
    required: true,
  })
  storageConditions: StorageConditionFeatureModel[];

  @Prop({
    type: [Types.ObjectId],
    ref: UnloadingMovingFeatureModel.name,
    required: true,
  })
  unloadingMovings: UnloadingMovingFeatureModel[];

  @Prop({
    type: [Types.ObjectId],
    ref: SpaceSecurityFeatureModel.name,
    required: true,
  })
  spaceSecurities: SpaceSecurityFeatureModel[];

  @Prop({
    type: [Types.ObjectId],
    ref: SpaceScheduleFeatureModel.name,
    required: true,
  })
  spaceSchedules: SpaceScheduleFeatureModel[];

  @Prop({
    type: [Types.ObjectId],
    ref: ImageModel.name,
    required: true,
  })
  spaceImages: ImageModel[];
}

export const SpaceForRentSchema =
  SchemaFactory.createForClass(SpaceForRentModel);
