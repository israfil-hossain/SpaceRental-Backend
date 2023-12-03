import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty } from "class-validator";

export class DocIdQueryDto {
  @ApiProperty({
    example: "616ff8cda5e18d001f2a3e58",
  })
  @IsMongoId()
  @IsNotEmpty()
  readonly DocId: string;
}
