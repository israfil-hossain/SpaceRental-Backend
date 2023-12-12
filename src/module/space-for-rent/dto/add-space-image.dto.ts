import { PickType } from "@nestjs/swagger";
import { CreateSpaceForRentDto } from "./create-space-for-rent.dto";

export class AddSpaceImageDto extends PickType(CreateSpaceForRentDto, [
  "spaceImages",
]) {}
