import { PartialType } from "@nestjs/swagger";
import { CreateSpaceSecurityDto } from "./create-space-security.dto";

export class UpdateSpaceSecurityDto extends PartialType(
  CreateSpaceSecurityDto,
) {}
