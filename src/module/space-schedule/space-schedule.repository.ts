import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { GenericRepository } from "../common/repository/generic-repository";
import {
  SpaceSchedule,
  SpaceScheduleDocument,
  SpaceScheduleType,
} from "./entities/space-schedule.entity";

@Injectable()
export class SpaceScheduleRepository extends GenericRepository<SpaceScheduleDocument> {
  private readonly logger: Logger;

  constructor(
    @InjectModel(SpaceSchedule.name)
    private model: SpaceScheduleType,
  ) {
    const logger = new Logger(SpaceScheduleRepository.name);
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
