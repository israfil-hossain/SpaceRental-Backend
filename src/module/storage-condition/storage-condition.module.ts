import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  StorageCondition,
  StorageConditionSchema,
} from "./entities/storage-condition.entity";
import { StorageConditionController } from "./storage-condition.controller";
import { StorageConditionRepository } from "./storage-condition.repository";
import { StorageConditionService } from "./storage-condition.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: StorageCondition.name,
        schema: StorageConditionSchema,
      },
    ]),
  ],
  controllers: [StorageConditionController],
  providers: [StorageConditionService, StorageConditionRepository],
  exports: [StorageConditionRepository],
})
export class StorageConditionModule {}
