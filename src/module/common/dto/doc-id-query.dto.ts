import { IsMongoId, IsNotEmpty } from "class-validator";

export class DocIdQueryDto {
  @IsMongoId()
  @IsNotEmpty()
  readonly DocId: string;
}
