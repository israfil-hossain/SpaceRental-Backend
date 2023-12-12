import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model } from "mongoose";
import { BaseEntity } from "../../common/entities/base.entity";

export type ImageDocument = HydratedDocument<ImageModel>;
export type ImageModelType = Model<ImageModel>;

@Schema({
  toJSON: {
    transform: function (_, ret) {
      delete ret?._id;
    },
    virtuals: true,
    versionKey: false,
  },
})
export class ImageModel extends BaseEntity {
  @Prop({ type: String, required: true, unique: true })
  url: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  extension: string;

  @Prop({ type: Number, required: true })
  size: number;

  @Prop({ type: String, required: true })
  mimeType: string;
}

export const ImageSchema = SchemaFactory.createForClass(ImageModel);
