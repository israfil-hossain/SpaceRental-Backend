import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { GenericRepository } from "../common/repository/generic-repository";
import {
  TermsCondition,
  TermsConditionDocument,
  TermsConditionType,
} from "./entities/terms-condition.entity";

@Injectable()
export class TermsConditionRepository extends GenericRepository<TermsConditionDocument> {
  constructor(
    @InjectModel(TermsCondition.name)
    private model: TermsConditionType,
  ) {
    super(model, new Logger(TermsConditionRepository.name));
  }
}
