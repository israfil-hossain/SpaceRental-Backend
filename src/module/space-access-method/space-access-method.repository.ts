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
  constructor(
    @InjectModel(SpaceAccessMethod.name)
    private model: SpaceAccessMethodType,
  ) {
    super(model, new Logger(SpaceAccessMethodRepository.name));
  }
}
