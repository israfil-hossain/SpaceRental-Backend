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
  private readonly logger: Logger;

  constructor(
    @InjectModel(UnloadingMoving.name)
    private model: UnloadingMovingType,
  ) {
    const logger = new Logger(UnloadingMovingRepository.name);
    super(model, logger);
    this.logger = logger;
  }

  async findAllForDropdown() {
    try {
      const result = await this.model
        .find({}, { value: "$_id", label: "$name", _id: 0 })
        .lean()
        .exec();

      return result;
    } catch (error) {
      this.logger.error("Error in findAllForDropdown:", error);
      throw error;
    }
  }
}
