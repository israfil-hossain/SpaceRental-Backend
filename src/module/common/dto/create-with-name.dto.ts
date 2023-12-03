import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateWithNameDto {
  @ApiProperty({
    description: "Name",
    example: "Example Name",
  })
  @IsString({ message: "Name must be a string" })
  name: string;
}
