import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { APP_GUARD, Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { RequiredRoles } from "../decorator/roles.decorator";
import { UserRoleEnum } from "../enum/user-role.enum";

@Injectable()
export class RolesGuard implements CanActivate {
  private readonly _logger = new Logger(RolesGuard.name);

  constructor(private _reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this._reflector.get<UserRoleEnum[]>(
      RequiredRoles,
      context.getHandler(),
    );

    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: ITokenPayload = request.user;

    if (!user || !roles.some((role: UserRoleEnum) => user.userRole === role)) {
      this._logger.error(
        `User does not have required roles: ${roles.join(", ")}`,
      );
      throw new ForbiddenException(
        "User is not authorized to perform this action",
      );
    }

    return true;
  }
}

export const RolesGuardProvider = {
  provide: APP_GUARD,
  useClass: RolesGuard,
};
