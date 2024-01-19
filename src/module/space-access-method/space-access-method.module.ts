import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  SpaceAccessMethod,
  SpaceAccessMethodSchema,
} from "./entities/space-access-method.entity";
import { SpaceAccessMethodController } from "./space-access-method.controller";
import { SpaceAccessMethodRepository } from "./space-access-method.repository";
import { SpaceAccessMethodService } from "./space-access-method.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SpaceAccessMethod.name, schema: SpaceAccessMethodSchema },
    ]),
  ],
  controllers: [SpaceAccessMethodController],
  providers: [SpaceAccessMethodService, SpaceAccessMethodRepository],
  exports: [SpaceAccessMethodRepository],
})
export class SpaceAccessMethodModule {}
