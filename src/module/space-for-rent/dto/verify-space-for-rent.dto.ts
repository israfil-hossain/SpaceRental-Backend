import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsMongoId, IsNotEmpty } from "class-validator";

export class VerifySpaceForRentDto {
  @ApiProperty({
    description: "Space document model Id",
  })
  @IsMongoId()
  @IsNotEmpty()
  readonly SpaceId: string;

  @ApiProperty({
    description: "Verify status of space for rent",
    default: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  readonly IsVerified: boolean;
}
