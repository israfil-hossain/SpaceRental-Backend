import { PartialType } from "@nestjs/swagger";
import { CreateSpaceAccessTypeDto } from "./create-space-access-type.dto";

export class UpdateSpaceAccessTypeDto extends PartialType(
  CreateSpaceAccessTypeDto,
) {}
