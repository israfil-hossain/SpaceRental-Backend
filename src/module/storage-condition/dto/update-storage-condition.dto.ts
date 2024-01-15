import { PartialType } from "@nestjs/swagger";
import { CreateStorageConditionDto } from "./create-storage-condition.dto";

export class UpdateStorageConditionDto extends PartialType(
  CreateStorageConditionDto,
) {}
