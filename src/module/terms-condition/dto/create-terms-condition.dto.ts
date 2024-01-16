import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateTermsConditionDto {
  @ApiProperty({
    description: "Name",
  })
  @IsNotEmpty({ message: "Name is required" })
  @IsString({ message: "Name must be a string" })
  name: string;

  @ApiProperty({
    description: "Checkbox Text",
  })
  @IsNotEmpty({ message: "Checkbox Text is required" })
  @IsString({ message: "Checkbox Text must be a string" })
  checkboxText: string;

  @ApiProperty({
    description: "Content",
  })
  @IsNotEmpty({ message: "Content is required" })
  @IsString({ message: "Content must be a string" })
  content: string;

  @ApiProperty({
    description: "Active Status",
    default: true,
  })
  @IsNotEmpty({ message: "Status is required" })
  @IsBoolean({ message: "Status must be a boolean" })
  isActive: boolean;
}
