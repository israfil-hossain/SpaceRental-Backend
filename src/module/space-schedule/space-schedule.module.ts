import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  SpaceSchedule,
  SpaceScheduleSchema,
} from "./entities/space-schedule.entity";
import { SpaceScheduleController } from "./space-schedule.controller";
import { SpaceScheduleRepository } from "./space-schedule.repository";
import { SpaceScheduleService } from "./space-schedule.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SpaceSchedule.name,
        schema: SpaceScheduleSchema,
      },
    ]),
  ],
  controllers: [SpaceScheduleController],
  providers: [SpaceScheduleService, SpaceScheduleRepository],
  exports: [SpaceScheduleRepository],
})
export class SpaceScheduleModule {}
