import { Prop } from "@nestjs/mongoose";
import { Schema as MongooseSchema } from "mongoose";
import { User } from "../../user/entities/user.entity";

export class BaseEntity {
  @Prop({ default: () => new Date() })
  createdAt: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  createdBy: User;

  @Prop({ default: null })
  updatedAt?: Date;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", default: null })
  updatedBy?: User;
}
