import {
  createParamDecorator,
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { ObjectId } from "mongodb";

export const AuthUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const logger = new Logger("AuthUserId");

    if (!request?.userId || !ObjectId.isValid(request?.userId)) {
      logger.error("Invalid user ID of logged-in user");
      throw new UnauthorizedException("Invalid user ID of logged-in user");
    }

    return request.userId;
  },
);
