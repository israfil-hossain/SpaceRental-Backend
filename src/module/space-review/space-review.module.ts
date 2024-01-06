import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SpaceForRentModule } from "../space-for-rent/space-for-rent.module";
import {
  SpaceReviewModel,
  SpaceReviewSchema,
} from "./entities/space-review.entity";
import { SpaceReviewController } from "./space-review.controller";
import { SpaceReviewService } from "./space-review.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SpaceReviewModel.name, schema: SpaceReviewSchema },
    ]),
    SpaceForRentModule,
  ],
  controllers: [SpaceReviewController],
  providers: [SpaceReviewService],
})
export class SpaceReviewModule {}
