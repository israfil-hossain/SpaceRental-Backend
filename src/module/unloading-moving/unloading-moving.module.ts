import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  UnloadingMoving,
  UnloadingMovingSchema,
} from "./entities/unloading-moving.entity";
import { UnloadingMovingController } from "./unloading-moving.controller";
import { UnloadingMovingRepository } from "./unloading-moving.repository";
import { UnloadingMovingService } from "./unloading-moving.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UnloadingMoving.name,
        schema: UnloadingMovingSchema,
      },
    ]),
  ],
  controllers: [UnloadingMovingController],
  providers: [UnloadingMovingService, UnloadingMovingRepository],
  exports: [UnloadingMovingRepository],
})
export class UnloadingMovingModule {}
