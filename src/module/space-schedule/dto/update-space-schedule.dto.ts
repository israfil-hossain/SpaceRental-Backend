import { PartialType } from "@nestjs/swagger";
import { CreateSpaceScheduleDto } from "./create-space-schedule.dto";

export class UpdateSpaceScheduleDto extends PartialType(
  CreateSpaceScheduleDto,
) {}
