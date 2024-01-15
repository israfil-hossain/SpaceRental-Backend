import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  SpaceAccessType,
  SpaceAccessTypeSchema,
} from "./entities/space-access-type.entity";
import { SpaceAccessTypeController } from "./space-access-type.controller";
import { SpaceAccessTypeService } from "./space-access-type.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SpaceAccessType.name, schema: SpaceAccessTypeSchema },
    ]),
  ],
  controllers: [SpaceAccessTypeController],
  providers: [SpaceAccessTypeService],
  exports: [SpaceAccessTypeService],
})
export class SpaceAccessTypeModule {}
