import { IsString } from "class-validator";

export class CreateSpaceAccessOptionDto {
  @IsString({ message: "Name must be a string" })
  name: string;
}
