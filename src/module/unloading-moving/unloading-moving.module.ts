import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  UnloadingMoving,
  UnloadingMovingSchema,
} from "./entities/unloading-moving.entity";
import { UnloadingMovingController } from "./unloading-moving.controller";
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
  providers: [UnloadingMovingService],
  exports: [UnloadingMovingService],
})
export class UnloadingMovingModule {}
