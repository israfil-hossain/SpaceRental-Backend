import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  StorageConditionFeature,
  StorageConditionFeatureSchema,
} from "./entities/storage-condition-feature.entity";
import { StorageConditionFeatureController } from "./storage-condition-feature.controller";
import { StorageConditionFeatureService } from "./storage-condition-feature.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: StorageConditionFeature.name,
        schema: StorageConditionFeatureSchema,
      },
    ]),
  ],
  controllers: [StorageConditionFeatureController],
  providers: [StorageConditionFeatureService],
})
export class StorageConditionFeatureModule {}
