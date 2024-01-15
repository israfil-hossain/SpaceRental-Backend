import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  UnloadingMovingFeature,
  UnloadingMovingFeatureSchema,
} from "./entities/unloading-moving-feature.entity";
import { UnloadingMovingFeatureController } from "./unloading-moving-feature.controller";
import { UnloadingMovingFeatureService } from "./unloading-moving-feature.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UnloadingMovingFeature.name,
        schema: UnloadingMovingFeatureSchema,
      },
    ]),
  ],
  controllers: [UnloadingMovingFeatureController],
  providers: [UnloadingMovingFeatureService],
  exports: [UnloadingMovingFeatureService],
})
export class UnloadingMovingFeatureModule {}
