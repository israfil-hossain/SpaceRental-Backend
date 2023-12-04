import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  SpaceScheduleFeature,
  SpaceScheduleFeatureSchema,
} from "./entities/space-schedule-feature";
import {
  SpaceSecurityFeature,
  SpaceSecurityFeatureSchema,
} from "./entities/space-security-feature";
import {
  StorageConditionFeature,
  StorageConditionFeatureSchema,
} from "./entities/storage-condition-feature";
import {
  UnloadingMovingFeature,
  UnloadingMovingFeatureSchema,
} from "./entities/unloading-moving-feature";
import { SpaceScheduleController } from "./space-schedule.controller";
import { SpaceScheduleService } from "./space-schedule.service";
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
        name: StorageConditionFeature.name,
        schema: StorageConditionFeatureSchema,
      },
      {
        name: UnloadingMovingFeature.name,
        schema: UnloadingMovingFeatureSchema,
      },
      { name: SpaceSecurityFeature.name, schema: SpaceSecurityFeatureSchema },
      { name: SpaceScheduleFeature.name, schema: SpaceScheduleFeatureSchema },
    ]),
  ],
  controllers: [
    SpaceScheduleController,
    SpaceSecurityController,
    StorageConditionController,
    UnloadingMovingController,
  ],
  providers: [
    SpaceScheduleService,
    SpaceSecurityService,
    StorageConditionService,
    UnloadingMovingService,
  ],
})
export class SpaceFeaturesModule {}
