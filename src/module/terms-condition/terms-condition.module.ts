import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  TermsCondition,
  TermsConditionSchema,
} from "./entities/terms-condition.entity";
import { TermsConditionController } from "./terms-condition.controller";
import { TermsConditionRepository } from "./terms-condition.repository";
import { TermsConditionService } from "./terms-condition.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TermsCondition.name, schema: TermsConditionSchema },
    ]),
  ],
  controllers: [TermsConditionController],
  providers: [TermsConditionService, TermsConditionRepository],
  exports: [TermsConditionRepository],
})
export class TermsConditionModule {}
