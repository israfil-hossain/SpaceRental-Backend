import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateSpaceTypeDto {
  @ApiProperty({
    description: "Name",
  })
  @IsNotEmpty({ message: "Name is required" })
  @IsString({ message: "Name must be a string" })
  name: string;

  @ApiProperty({
    description: "Active Status",
    default: true,
  })
  @IsNotEmpty({ message: "Status is required" })
  @IsBoolean({ message: "Status must be a boolean" })
  isActive: boolean;
}
