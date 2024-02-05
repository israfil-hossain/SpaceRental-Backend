import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { GenericRepository } from "../common/repository/generic-repository";
import {
  StorageCondition,
  StorageConditionDocument,
  StorageConditionType,
} from "./entities/storage-condition.entity";

@Injectable()
export class StorageConditionRepository extends GenericRepository<StorageConditionDocument> {
  private readonly logger: Logger;

  constructor(
    @InjectModel(StorageCondition.name)
    private model: StorageConditionType,
  ) {
    const logger = new Logger(StorageConditionRepository.name);
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
