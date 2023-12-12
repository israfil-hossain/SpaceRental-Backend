import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ImageModule } from "../image/image.module";
import {
  SpaceForRentModel,
  SpaceForRentSchema,
} from "./entities/space-for-rent.entity";
import { SpaceForRentController } from "./space-for-rent.controller";
import { SpaceForRentService } from "./space-for-rent.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SpaceForRentModel.name, schema: SpaceForRentSchema },
    ]),
    ImageModule,
  ],
  controllers: [SpaceForRentController],
  providers: [SpaceForRentService],
})
export class SpaceForRentModule {}
