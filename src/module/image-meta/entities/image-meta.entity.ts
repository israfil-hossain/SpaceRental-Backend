import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model, Types } from "mongoose";

export type ImageMetaDocument = HydratedDocument<ImageMeta>;
export type ImageMetaType = Model<ImageMeta>;

@Schema({
  toJSON: {
    transform: function (_, ret) {
      delete ret?.ownerId;
    },
  },
})
export class ImageMeta {
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

  @Prop({
    type: Types.ObjectId,
    required: true,
  })
  ownerId: Types.ObjectId;
}

export const ImageMetaSchema = SchemaFactory.createForClass(ImageMeta);
