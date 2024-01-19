import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SpaceType, SpaceTypeSchema } from "./entities/space-type.entity";
import { SpaceTypeController } from "./space-type.controller";
import { SpaceTypeRepository } from "./space-type.repository";
import { SpaceTypeService } from "./space-type.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SpaceType.name, schema: SpaceTypeSchema },
    ]),
  ],
  controllers: [SpaceTypeController],
  providers: [SpaceTypeService, SpaceTypeRepository],
  exports: [SpaceTypeRepository],
})
export class SpaceTypeModule {}
