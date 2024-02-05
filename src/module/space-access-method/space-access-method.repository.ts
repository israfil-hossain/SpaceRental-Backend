import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { GenericRepository } from "../common/repository/generic-repository";
import {
  SpaceAccessMethod,
  SpaceAccessMethodDocument,
  SpaceAccessMethodType,
} from "./entities/space-access-method.entity";

@Injectable()
export class SpaceAccessMethodRepository extends GenericRepository<SpaceAccessMethodDocument> {
  private readonly logger: Logger;

  constructor(
    @InjectModel(SpaceAccessMethod.name)
    private model: SpaceAccessMethodType,
  ) {
    const logger = new Logger(SpaceAccessMethodRepository.name);
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
