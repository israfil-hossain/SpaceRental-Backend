import { Global, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CloudinaryProvider } from "../../utility/provider/cloudinary.provider";
import { ImageModel, ImageSchema } from "./entities/image.entity";
import { ImageService } from "./image.service";

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: ImageModel.name, schema: ImageSchema }]),
  ],
  providers: [ImageService, CloudinaryProvider],
  exports: [ImageService],
})
export class ImageModule {}
