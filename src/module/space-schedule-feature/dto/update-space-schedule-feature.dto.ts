import { PartialType } from "@nestjs/swagger";
import { CreateSpaceScheduleFeatureDto } from "./create-space-schedule-feature.dto";

export class UpdateSpaceScheduleFeatureDto extends PartialType(
  CreateSpaceScheduleFeatureDto,
) {}
