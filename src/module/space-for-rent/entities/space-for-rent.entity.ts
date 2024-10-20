import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model, Types } from "mongoose";
import { BaseEntity } from "../../common/entities/base.entity";
import { ImageMeta } from "../../image-meta/entities/image-meta.entity";
import { SpaceAccessMethod } from "../../space-access-method/entities/space-access-method.entity";
import { SpaceSchedule } from "../../space-schedule/entities/space-schedule.entity";
import { SpaceSecurity } from "../../space-security/entities/space-security.entity";
import { SpaceType } from "../../space-type/entities/space-type.entity";
import { StorageCondition } from "../../storage-condition/entities/storage-condition.entity";
import { UnloadingMoving } from "../../unloading-moving/entities/unloading-moving.entity";
import { ApplicationUser } from "../../application-user/entities/application-user.entity";

export type SpaceForRentDocument = HydratedDocument<SpaceForRent>;
export type SpaceForRentType = Model<SpaceForRentDocument>;

@Schema()
export class SpaceForRent extends BaseEntity {
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
  pricePerMonth: number;

  @Prop({ type: Number, required: true })
  minimumBookingDays: number;

  @Prop({ type: Boolean, default: false })
  requiresApproval: boolean;

  @Prop({
    type: [Types.ObjectId],
    ref: ImageMeta.name,
    required: true,
  })
  spaceImages: string[];

  @Prop({
    type: Types.ObjectId,
    ref: SpaceType.name,
    required: true,
  })
  type: string;

  @Prop({
    type: Types.ObjectId,
    ref: SpaceAccessMethod.name,
    required: true,
  })
  accessMethod: string;

  @Prop({
    type: [Types.ObjectId],
    ref: StorageCondition.name,
    required: false,
  })
  storageConditions?: string[];

  @Prop({
    type: [Types.ObjectId],
    ref: UnloadingMoving.name,
    required: false,
  })
  unloadingMovings?: string[];

  @Prop({
    type: [Types.ObjectId],
    ref: SpaceSecurity.name,
    required: false,
  })
  spaceSecurities?: string[];

  @Prop({
    type: [Types.ObjectId],
    ref: SpaceSchedule.name,
    required: false,
  })
  spaceSchedules?: string[];

  @Prop({
    type: [Types.ObjectId],
    ref: ApplicationUser.name,
    required: false,
  })
  favorites: string[];
}

export const SpaceForRentSchema = SchemaFactory.createForClass(SpaceForRent);

