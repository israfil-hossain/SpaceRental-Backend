import { PartialType } from "@nestjs/swagger";
import { CreateSpaceAccessOptionDto } from "./create-space-access-option.dto";

export class UpdateSpaceAccessOptionDto extends PartialType(
  CreateSpaceAccessOptionDto,
) {}
