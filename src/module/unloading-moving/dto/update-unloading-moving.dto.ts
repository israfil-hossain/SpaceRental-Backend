import { PartialType } from "@nestjs/swagger";
import { CreateUnloadingMovingDto } from "./create-unloading-moving.dto";

export class UpdateUnloadingMovingDto extends PartialType(
  CreateUnloadingMovingDto,
) {}
