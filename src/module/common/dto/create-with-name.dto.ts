import { IsString } from "class-validator";

export class CreateWithNameDto {
  @IsString({ message: "Name must be a string" })
  name: string;
}
