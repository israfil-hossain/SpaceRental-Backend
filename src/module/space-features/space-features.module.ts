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
import { SpaceFeaturesController } from "./space-features.controller";
import { SpaceFeaturesService } from "./space-features.service";

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
  controllers: [SpaceFeaturesController],
  providers: [SpaceFeaturesService],
})
export class SpaceFeaturesModule {}
