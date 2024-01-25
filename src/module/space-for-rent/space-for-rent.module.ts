import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ImageMetaModule } from "../image-meta/image-meta.module";
import { SpaceAccessMethodModule } from "../space-access-method/space-access-method.module";
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
import { SpaceForRentRepository } from "./space-for-rent.repository";
import { SpaceForRentService } from "./space-for-rent.service";
import { SpaceForRentValidator } from "./space-for-rent.validator";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SpaceForRent.name, schema: SpaceForRentSchema },
    ]),
    SpaceTypeModule,
    SpaceAccessMethodModule,
    StorageConditionModule,
    UnloadingMovingModule,
    SpaceSecurityModule,
    SpaceScheduleModule,
    ImageMetaModule,
  ],
  controllers: [SpaceForRentController],
  providers: [
    SpaceForRentService,
    SpaceForRentValidator,
    SpaceForRentRepository,
  ],
  exports: [SpaceForRentService, SpaceForRentRepository],
})
export class SpaceForRentModule {}
