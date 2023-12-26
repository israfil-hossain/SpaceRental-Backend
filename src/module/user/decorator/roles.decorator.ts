import { Reflector } from "@nestjs/core";
import { UserRoleEnum } from "../enum/user-role.enum";

export const RequiredRoles = Reflector.createDecorator<UserRoleEnum[]>();
