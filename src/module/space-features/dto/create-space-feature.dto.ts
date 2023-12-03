import { IsString } from "class-validator";

export class CreateSpaceFeatureDto {
  @IsString({ message: "Name must be a string" })
  name: string;
}
