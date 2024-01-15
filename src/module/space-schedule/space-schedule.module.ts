import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  SpaceSchedule,
  SpaceScheduleSchema,
} from "./entities/space-schedule.entity";
import { SpaceScheduleController } from "./space-schedule.controller";
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
  providers: [SpaceScheduleService],
  exports: [SpaceScheduleService],
})
export class SpaceScheduleModule {}
