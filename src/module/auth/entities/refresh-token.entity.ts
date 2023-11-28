import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model, Schema as MongooseSchema } from "mongoose";
import { User } from "../../user/entities/user.entity";

export type RefreshTokenDocument = HydratedDocument<RefreshToken>;
export type RefreshTokenModelType = Model<RefreshToken>;

@Schema({
  toJSON: {
    transform: function (_, ret) {
      delete ret?.token;
    },
    versionKey: false,
  },
})
export class RefreshToken {
  @Prop({ type: String, required: true, unique: true })
  token: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User", required: true })
  user: User;

  @Prop({
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    // Explanation: 30 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
  })
  expiresAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
