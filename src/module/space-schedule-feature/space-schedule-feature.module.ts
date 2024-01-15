import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  SpaceScheduleFeature,
  SpaceScheduleFeatureSchema,
} from "./entities/space-schedule-feature.entity";
import { SpaceScheduleFeatureController } from "./space-schedule-feature.controller";
import { SpaceScheduleFeatureService } from "./space-schedule-feature.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SpaceScheduleFeature.name,
        schema: SpaceScheduleFeatureSchema,
      },
    ]),
  ],
  controllers: [SpaceScheduleFeatureController],
  providers: [SpaceScheduleFeatureService],
  exports: [SpaceScheduleFeatureService],
})
export class SpaceScheduleFeatureModule {}
