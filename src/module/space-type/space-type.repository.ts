import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { GenericRepository } from "../common/repository/generic-repository";
import {
  SpaceType,
  SpaceTypeDocument,
  SpaceTypeType,
} from "./entities/space-type.entity";

@Injectable()
export class SpaceTypeRepository extends GenericRepository<SpaceTypeDocument> {
  private readonly logger: Logger;

  constructor(
    @InjectModel(SpaceType.name)
    private model: SpaceTypeType,
  ) {
    const logger = new Logger(SpaceTypeRepository.name);
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
