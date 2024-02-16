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
  constructor(
    @InjectModel(StorageCondition.name)
    private model: StorageConditionType,
  ) {
    super(model, new Logger(StorageConditionRepository.name));
  }
}
