import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model, Types } from "mongoose";
import { UserModel } from "../../user/entities/user.entity";

export type RefreshTokenDocument = HydratedDocument<RefreshTokenModel>;
export type RefreshTokenModelType = Model<RefreshTokenModel>;

@Schema({
  toJSON: {
    transform: function (_, ret) {
      delete ret?.token;
    },
  },
})
export class RefreshTokenModel {
  @Prop({ type: String, required: true, unique: true })
  token: string;

  @Prop({ type: Types.ObjectId, ref: UserModel.name, required: true })
  user: UserModel;

  @Prop({
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    // Explanation: 30 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
  })
  expiresAt: Date;
}

export const RefreshTokenSchema =
  SchemaFactory.createForClass(RefreshTokenModel);
