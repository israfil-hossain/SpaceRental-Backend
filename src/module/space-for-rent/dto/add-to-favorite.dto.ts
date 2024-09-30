import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty } from "class-validator";

export class AddToFavoriteDto {
  @ApiProperty({
    description: "Space document model Id",
  })
  @IsMongoId()
  @IsNotEmpty()
  readonly SpaceId: string;
}

