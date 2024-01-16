import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  SpaceAccessType,
  SpaceAccessTypeSchema,
} from "../space-access-type/entities/space-access-type.entity";
import {
  SpaceSchedule,
  SpaceScheduleSchema,
} from "../space-schedule/entities/space-schedule.entity";
import {
  SpaceSecurity,
  SpaceSecuritySchema,
} from "../space-security/entities/space-security.entity";
import {
  SpaceType,
  SpaceTypeSchema,
} from "../space-type/entities/space-type.entity";
import {
  StorageCondition,
  StorageConditionSchema,
} from "../storage-condition/entities/storage-condition.entity";
import {
  UnloadingMoving,
  UnloadingMovingSchema,
} from "../unloading-moving/entities/unloading-moving.entity";
import {
  SpaceForRent,
  SpaceForRentSchema,
} from "./entities/space-for-rent.entity";
import { SpaceForRentController } from "./space-for-rent.controller";
import { SpaceForRentService } from "./space-for-rent.service";
import { SpaceForRentSubService } from "./space-for-rent.sub.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SpaceForRent.name, schema: SpaceForRentSchema },
      { name: SpaceType.name, schema: SpaceTypeSchema },
      { name: SpaceAccessType.name, schema: SpaceAccessTypeSchema },
      {
        name: SpaceSchedule.name,
        schema: SpaceScheduleSchema,
      },
      {
        name: SpaceSecurity.name,
        schema: SpaceSecuritySchema,
      },
      {
        name: StorageCondition.name,
        schema: StorageConditionSchema,
      },
      {
        name: UnloadingMoving.name,
        schema: UnloadingMovingSchema,
      },
    ]),
  ],
  controllers: [SpaceForRentController],
  providers: [SpaceForRentService, SpaceForRentSubService],
  exports: [SpaceForRentService],
})
export class SpaceForRentModule {}
