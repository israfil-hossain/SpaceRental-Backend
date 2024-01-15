import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ImageMetaModule } from "../image-meta/image-meta.module";
import { SpaceAccessTypeModule } from "../space-access-type/space-access-type.module";
import { SpaceScheduleModule } from "../space-schedule/space-schedule.module";
import { SpaceSecurityModule } from "../space-security/space-security.module";
import { SpaceTypeModule } from "../space-type/space-type.module";
import { StorageConditionModule } from "../storage-condition/storage-condition.module";
import { UnloadingMovingModule } from "../unloading-moving/unloading-moving.module";
import {
  SpaceForRent,
  SpaceForRentSchema,
} from "./entities/space-for-rent.entity";
import { SpaceForRentController } from "./space-for-rent.controller";
import { SpaceForRentService } from "./space-for-rent.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SpaceForRent.name, schema: SpaceForRentSchema },
    ]),
    ImageMetaModule,
    SpaceTypeModule,
    SpaceAccessTypeModule,
    SpaceScheduleModule,
    SpaceSecurityModule,
    StorageConditionModule,
    UnloadingMovingModule,
  ],
  controllers: [SpaceForRentController],
  providers: [SpaceForRentService],
  exports: [SpaceForRentService],
})
export class SpaceForRentModule {}
