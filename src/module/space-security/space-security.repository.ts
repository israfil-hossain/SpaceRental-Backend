import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { GenericRepository } from "../common/repository/generic-repository";
import {
  SpaceSecurity,
  SpaceSecurityDocument,
  SpaceSecurityType,
} from "./entities/space-security.entity";

@Injectable()
export class SpaceSecurityRepository extends GenericRepository<SpaceSecurityDocument> {
  private readonly logger: Logger;

  constructor(
    @InjectModel(SpaceSecurity.name)
    private model: SpaceSecurityType,
  ) {
    const logger = new Logger(SpaceSecurityRepository.name);
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
