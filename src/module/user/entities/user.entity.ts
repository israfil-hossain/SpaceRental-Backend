import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";

export type UserDocument = HydratedDocument<User>;
export type UserModelType = Model<User>;

@Schema({
  toJSON: {
    transform: function (_, ret) {
      delete ret?.password;
      delete ret?.isPasswordLess;
    },
    versionKey: false,
  },
})
export class User {
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop()
  password?: string;

  @Prop({ default: false })
  isPasswordLess: boolean;

  @Prop({ default: () => new Date() })
  dateJoined: Date;

  @Prop({ default: () => new Date() })
  lastLogin: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
