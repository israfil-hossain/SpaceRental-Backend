import { Prop } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { User } from "../../user/entities/user.entity";

export class BaseEntity {
  @Prop({ default: () => new Date() })
  createdAt: Date;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  createdBy: User;

  @Prop({ default: null })
  updatedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: User.name, default: null })
  updatedBy?: User;
}
