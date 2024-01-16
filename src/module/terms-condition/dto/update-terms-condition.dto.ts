import { PartialType } from "@nestjs/swagger";
import { CreateTermsConditionDto } from "./create-terms-condition.dto";

export class UpdateTermsConditionDto extends PartialType(
  CreateTermsConditionDto,
) {}
