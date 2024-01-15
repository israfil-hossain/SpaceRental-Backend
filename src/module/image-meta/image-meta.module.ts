import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CloudinaryProvider } from "../../utility/provider/cloudinary.provider";
import { ImageMeta, ImageMetaSchema } from "./entities/image-meta.entity";
import { ImageMetaService } from "./image-meta.service";

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ImageMeta.name, schema: ImageMetaSchema },
    ]),
  ],
  providers: [ImageMetaService, CloudinaryProvider],
  exports: [ImageMetaService],
})
export class ImageMetaModule {}
