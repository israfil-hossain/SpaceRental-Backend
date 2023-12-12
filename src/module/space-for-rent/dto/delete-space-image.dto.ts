import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty } from "class-validator";

export class DeleteSpaceImageDto {
  @ApiProperty({
    description: "Space document model Id",
  })
  @IsMongoId()
  @IsNotEmpty()
  readonly SpaceId: string;

  @ApiProperty({
    description: "Image document model Id",
  })
  @IsMongoId()
  @IsNotEmpty()
  readonly ImageId: string;
}
