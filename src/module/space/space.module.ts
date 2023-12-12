import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ImageModule } from "../image/image.module";
import { SpaceModel, SpaceSchema } from "./entities/space.entity";
import { SpaceController } from "./space.controller";
import { SpaceService } from "./space.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SpaceModel.name, schema: SpaceSchema }]),
    ImageModule,
  ],
  controllers: [SpaceController],
  providers: [SpaceService],
})
export class SpaceModule {}
