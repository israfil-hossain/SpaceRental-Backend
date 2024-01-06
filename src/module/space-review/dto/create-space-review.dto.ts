import { ApiProperty } from "@nestjs/swagger";
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

export class CreateSpaceReviewDto {
  @ApiProperty({
    required: true,
    description: "The space ID for review",
  })
  @IsNotEmpty({ message: "Space Id is required" })
  @IsMongoId({ message: "Invalid space Id" })
  space: string;

  @ApiProperty({
    required: true,
    type: Number,
    description: "The rating for the space (must be between 1 and 5)",
    minimum: 1,
    maximum: 5,
    default: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({
    required: false,
    type: String,
    description: "Optional comment for the space review",
    default: "",
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
