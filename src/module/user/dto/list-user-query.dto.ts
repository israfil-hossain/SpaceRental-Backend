import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";
import { PaginationQuery } from "../../common/dto/pagintation-query.dto";
import { UserRoleDtoEnum } from "../enum/user-role.enum";

export class ListUserQuery extends PaginationQuery {
  @ApiProperty({
    description: "Email of the user",
    required: false,
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  public readonly Email?: string;

  @ApiProperty({
    description: "Name of the user",
    required: false,
  })
  @Type(() => String)
  @IsString()
  @IsOptional()
  public readonly Name?: string;

  @ApiProperty({
    description: "User's role",
    enum: UserRoleDtoEnum,
    required: false,
  })
  @IsOptional()
  public readonly UserRole?: UserRoleDtoEnum;
}
