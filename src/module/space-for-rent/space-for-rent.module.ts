import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ImageModule } from "../image/image.module";
import { SpaceAccessOptionModule } from "../space-access-option/space-access-option.module";
import { SpaceFeaturesModule } from "../space-features/space-features.module";
import { SpaceTypeModule } from "../space-type/space-type.module";
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
    SpaceFeaturesModule,
    SpaceTypeModule,
    SpaceAccessOptionModule,
  ],
  controllers: [SpaceForRentController],
  providers: [SpaceForRentService],
})
export class SpaceForRentModule {}
