import { PartialType } from "@nestjs/swagger";
import { CreateSpaceAccessMethodDto } from "./create-space-access-method.dto";

export class UpdateSpaceAccessMethodDto extends PartialType(
  CreateSpaceAccessMethodDto,
) {}
