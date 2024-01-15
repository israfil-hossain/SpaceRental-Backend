import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model, Types } from "mongoose";
import { ImageMeta } from "../../image-meta/entities/image-meta.entity";
import { ApplicationUserRoleEnum } from "../enum/application-user-role.enum";

export type ApplicationUserDocument = HydratedDocument<ApplicationUser>;
export type ApplicationUserType = Model<ApplicationUser>;

@Schema({
  toJSON: {
    transform: function (_, ret) {
      delete ret?.password;
      delete ret?.isPasswordLess;
    },
  },
})
export class ApplicationUser {
  @Prop({ required: true })
  email: string;

  @Prop({ default: "" })
  password: string;

  @Prop({ default: false })
  isPasswordLess: boolean;

  @Prop({
    type: String,
    enum: Object.values(ApplicationUserRoleEnum),
    default: ApplicationUserRoleEnum.RENTER,
  })
  role: ApplicationUserRoleEnum;

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

  @Prop({ default: true })
  isActive: boolean;

  @Prop({
    type: Types.ObjectId,
    ref: ImageMeta.name,
  })
  profilePicture?: ImageMeta;
}

export const ApplicationUserSchema =
  SchemaFactory.createForClass(ApplicationUser);

// Bind user email with role to be unique together
ApplicationUserSchema.index({ email: 1, role: 1 }, { unique: true });
