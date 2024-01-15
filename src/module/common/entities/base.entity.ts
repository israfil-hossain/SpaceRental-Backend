import { Prop } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { ApplicationUser } from "../../application-user/entities/application-user.entity";

export class BaseEntity {
  @Prop({ default: () => new Date() })
  createdAt?: Date;

  @Prop({
    type: Types.ObjectId,
    ref: ApplicationUser.name,
    required: true,
  })
  createdBy?: ApplicationUser;

  @Prop({ default: null })
  updatedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: ApplicationUser.name, default: null })
  updatedBy?: ApplicationUser;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}
