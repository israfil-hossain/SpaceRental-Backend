import { PartialType } from "@nestjs/swagger";
import { CreateUnloadingMovingFeatureDto } from "./create-unloading-moving-feature.dto";

export class UpdateUnloadingMovingFeatureDto extends PartialType(
  CreateUnloadingMovingFeatureDto,
) {}
