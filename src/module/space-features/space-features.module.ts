import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  SpaceSecurityFeatureModel,
  SpaceSecurityFeatureSchema,
} from "./entities/space-security-feature";
import {
  StorageConditionFeatureModel,
  StorageConditionFeatureSchema,
} from "./entities/storage-condition-feature";
import {
  UnloadingMovingFeatureModel,
  UnloadingMovingFeatureSchema,
} from "./entities/unloading-moving-feature";
import { SpaceSecurityController } from "./space-security.controller";
import { SpaceSecurityService } from "./space-security.service";
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
      {
        name: SpaceSecurityFeatureModel.name,
        schema: SpaceSecurityFeatureSchema,
      },
    ]),
  ],
  controllers: [
    StorageConditionController,
    UnloadingMovingController,
    SpaceSecurityController,
  ],
  providers: [
    StorageConditionService,
    UnloadingMovingService,
    SpaceSecurityService,
  ],
})
export class SpaceFeaturesModule {}
