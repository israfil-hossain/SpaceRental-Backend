import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { GenericRepository } from "../common/repository/generic-repository";
import {
  UnloadingMoving,
  UnloadingMovingDocument,
  UnloadingMovingType,
} from "./entities/unloading-moving.entity";

@Injectable()
export class UnloadingMovingRepository extends GenericRepository<UnloadingMovingDocument> {
  constructor(
    @InjectModel(UnloadingMoving.name)
    private model: UnloadingMovingType,
  ) {
    super(model, new Logger(UnloadingMovingRepository.name));
  }
}
