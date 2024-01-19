import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { GenericRepository } from "../common/repository/generic-repository";
import {
  SpaceAccessType,
  SpaceAccessTypeDocument,
  SpaceAccessTypeType,
} from "./entities/space-access-type.entity";

@Injectable()
export class SpaceAccessTypeRepository extends GenericRepository<SpaceAccessTypeDocument> {
  constructor(
    @InjectModel(SpaceAccessType.name)
    private model: SpaceAccessTypeType,
  ) {
    super(model, new Logger(SpaceAccessTypeRepository.name));
  }
}
