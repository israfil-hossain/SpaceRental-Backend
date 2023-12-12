import { OmitType, PartialType } from "@nestjs/swagger";
import { CreateSpaceForRentDto } from "./create-space-for-rent.dto";

export class UpdateSpaceForRentDto extends PartialType(
  OmitType(CreateSpaceForRentDto, ["spaceImages"]),
) {}
