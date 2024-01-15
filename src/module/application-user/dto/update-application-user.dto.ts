import { PartialType } from "@nestjs/swagger";
import { CreateApplicationUserDto } from "./create-application-user.dto";

export class UpdateApplicationUserDto extends PartialType(
  CreateApplicationUserDto,
) {}
