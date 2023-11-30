import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { ObjectId } from "mongodb";

export const UserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();

    if (!request?.userId || !ObjectId.isValid(request?.userId)) {
      throw new UnauthorizedException("Invalid user ID of logged-in user");
    }

    return request.userId;
  },
);
