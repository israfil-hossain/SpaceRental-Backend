import { PartialType } from "@nestjs/swagger";
import { CreateStorageConditionFeatureDto } from "./create-storage-condition-feature.dto";

export class UpdateStorageConditionFeatureDto extends PartialType(
  CreateStorageConditionFeatureDto,
) {}
