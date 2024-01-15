import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model, Types } from "mongoose";
import { BaseEntity } from "../../common/entities/base.entity";
import { ImageMeta } from "../../image-meta/entities/image-meta.entity";
import { SpaceAccessType } from "../../space-access-option/entities/space-access-type.entity";
import { SpaceScheduleFeature } from "../../space-schedule-feature/entities/space-schedule-feature.entity";
import { SpaceSecurityFeature } from "../../space-security-feature/entities/space-security-feature.entity";
import { SpaceTypeModel } from "../../space-type/entities/space-type.entity";
import { StorageConditionFeature } from "../../storage-condition-feature/entities/storage-condition-feature.entity";
import { UnloadingMovingFeature } from "../../unloading-moving-feature/entities/unloading-moving-feature.entity";

export type SpaceForRentDocument = HydratedDocument<SpaceForRentModel>;
export type SpaceForRentModelType = Model<SpaceForRentModel>;

@Schema()
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

  @Prop({ type: Boolean, default: false })
  isVerifiedByAdmin: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: SpaceTypeModel.name,
    required: true,
  })
  type: SpaceTypeModel;

  @Prop({
    type: Types.ObjectId,
    ref: SpaceAccessType.name,
    required: true,
  })
  accessMethod: SpaceAccessType;

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

  @Prop({
    type: [Types.ObjectId],
    ref: ImageMeta.name,
    required: true,
  })
  spaceImages: ImageMeta[];
}

export const SpaceForRentSchema =
  SchemaFactory.createForClass(SpaceForRentModel);
