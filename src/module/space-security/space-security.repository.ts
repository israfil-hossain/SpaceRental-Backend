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
  constructor(
    @InjectModel(SpaceSecurity.name)
    private model: SpaceSecurityType,
  ) {
    super(model, new Logger(SpaceSecurityRepository.name));
  }
}
