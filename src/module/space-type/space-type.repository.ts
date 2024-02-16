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
  constructor(
    @InjectModel(SpaceType.name)
    private model: SpaceTypeType,
  ) {
    super(model, new Logger(SpaceTypeRepository.name));
  }
}
