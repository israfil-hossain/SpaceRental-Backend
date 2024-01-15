import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  StorageConditionFeatureModel,
  StorageConditionFeatureSchema,
} from "./entities/storage-condition-feature";
import {
  UnloadingMovingFeatureModel,
  UnloadingMovingFeatureSchema,
} from "./entities/unloading-moving-feature";
import { StorageConditionController } from "./storage-condition.controller";
import { StorageConditionService } from "./storage-condition.service";
import { UnloadingMovingController } from "./unloading-moving.controller";
import { UnloadingMovingService } from "./unloading-moving.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: StorageConditionFeatureModel.name,
        schema: StorageConditionFeatureSchema,
      },
      {
        name: UnloadingMovingFeatureModel.name,
        schema: UnloadingMovingFeatureSchema,
      },
    ]),
  ],
  controllers: [StorageConditionController, UnloadingMovingController],
  providers: [StorageConditionService, UnloadingMovingService],
})
export class SpaceFeaturesModule {}
