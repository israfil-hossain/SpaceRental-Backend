import { PartialType } from "@nestjs/swagger";
import { CreateSpaceSecurityFeatureDto } from "./create-space-security-feature.dto";

export class UpdateSpaceSecurityFeatureDto extends PartialType(
  CreateSpaceSecurityFeatureDto,
) {}
