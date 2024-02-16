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
  constructor(
    @InjectModel(SpaceSchedule.name)
    private model: SpaceScheduleType,
  ) {
    super(model, new Logger(SpaceScheduleRepository.name));
  }
}
