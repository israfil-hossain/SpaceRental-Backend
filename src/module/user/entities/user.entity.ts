import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { UserRole } from "../enum/user-role.enum";

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
  @Prop({ required: true })
  email: string;

  @Prop({ default: "" })
  password: string;

  @Prop({ default: false })
  isPasswordLess: boolean;

  @Prop({
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.RENTER,
  })
  role: UserRole;

  @Prop({ default: null })
  fullName?: string;

  @Prop({ default: null })
  phoneNumber?: string;

  @Prop({ default: null })
  countryCode?: string;

  @Prop({ default: null })
  dateOfBirth?: Date;

  @Prop({ default: () => new Date() })
  dateJoined: Date;

  @Prop({ default: () => new Date() })
  lastLogin: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Bind user email with role to be unique together
UserSchema.index({ email: 1, role: 1 }, { unique: true });
