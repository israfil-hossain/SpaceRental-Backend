import { IsMongoId, IsNotEmpty } from "class-validator";

export class UserIdQueryDto {
  @IsMongoId()
  @IsNotEmpty()
  readonly UserId: string;
}
