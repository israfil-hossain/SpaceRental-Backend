import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { GenericRepository } from "../common/repository/generic-repository";
import {
  SpaceReview,
  SpaceReviewDocument,
  SpaceReviewType,
} from "./entities/space-review.entity";

@Injectable()
export class SpaceReviewRepository extends GenericRepository<SpaceReviewDocument> {
  constructor(
    @InjectModel(SpaceReview.name)
    private model: SpaceReviewType,
  ) {
    super(model, new Logger(SpaceReviewRepository.name));
  }
}
