import { Prop } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { UserModel } from "../../user/entities/user.entity";

export class BaseEntity {
  @Prop({ default: () => new Date() })
  createdAt?: Date;

  @Prop({ type: Types.ObjectId, ref: UserModel.name, required: true })
  createdBy?: UserModel;

  @Prop({ default: null })
  updatedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: UserModel.name, default: null })
  updatedBy?: UserModel;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}
