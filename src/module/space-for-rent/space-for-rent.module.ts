import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ImageMetaModule } from "../image-meta/image-meta.module";
import { SpaceAccessOptionModule } from "../space-access-option/space-access-option.module";
import { SpaceScheduleFeatureModule } from "../space-schedule-feature/space-schedule-feature.module";
import { SpaceSecurityFeatureModule } from "../space-security-feature/space-security-feature.module";
import { SpaceTypeModule } from "../space-type/space-type.module";
import { StorageConditionFeatureModule } from "../storage-condition-feature/storage-condition-feature.module";
import { UnloadingMovingFeatureModule } from "../unloading-moving-feature/unloading-moving-feature.module";
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
    ImageMetaModule,
    SpaceTypeModule,
    SpaceAccessOptionModule,
    SpaceScheduleFeatureModule,
    SpaceSecurityFeatureModule,
    StorageConditionFeatureModule,
    UnloadingMovingFeatureModule,
  ],
  controllers: [SpaceForRentController],
  providers: [SpaceForRentService],
  exports: [SpaceForRentService],
})
export class SpaceForRentModule {}
