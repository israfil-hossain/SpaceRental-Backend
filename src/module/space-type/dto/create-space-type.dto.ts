import { IsString } from "class-validator";

export class CreateSpaceTypeDto {
  @IsString({ message: "Name must be a string" })
  name: string;
}
