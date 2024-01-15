import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import * as base64url from "base64url";
import * as uuid from "uuid";
import {
  ApplicationUser,
  ApplicationUserDocument,
} from "../application-user/entities/application-user.entity";
import {
  RefreshToken,
  RefreshTokenDocument,
  RefreshTokenType,
} from "./entities/refresh-token.entity";

@Injectable()
export class UserTokenService {
  private readonly _logger: Logger = new Logger(UserTokenService.name);

  constructor(
    private _jwtService: JwtService,
    @InjectModel(RefreshToken.name)
    private _refreshToken: RefreshTokenType,
  ) {}

  public async generateAccessToken(user: ApplicationUserDocument) {
    const tokenPayload: ITokenPayload = {
      userId: user?.id?.toString(),
      userRole: user.role,
    };

    return await this._jwtService.signAsync(tokenPayload);
  }

  public async createRefreshTokenWithUserId(
    user: ApplicationUserDocument,
  ): Promise<string> {
    try {
      const token = base64url.default(
        Buffer.from(uuid.v4().replace(/-/g, ""), "hex"),
      );

      const refreshToken = await this._refreshToken.create({
        token,
        user: user?.id?.toString(),
      });

      await refreshToken.save();
      return refreshToken.token;
    } catch (error) {
      this._logger.error("Error generating token", error);
      throw new InternalServerErrorException("Error generating token");
    }
  }

  public async getRefreshTokenByToken(
    refreshToken: string,
  ): Promise<RefreshTokenDocument> {
    if (!refreshToken) {
      this._logger.error("A valid refresh token is required");
      throw new BadRequestException("A valid refresh token is required");
    }

    const refreshTokenDoc = await this._refreshToken
      .findOne({
        token: refreshToken,
        expiresAt: { $gt: new Date() },
      })
      .populate([
        {
          path: "user",
          model: ApplicationUser.name,
          select: "id role",
        },
      ])
      .exec();

    if (!refreshTokenDoc) {
      this._logger.error("Refresh token is invalid or expired");
      throw new BadRequestException("Refresh token is invalid or expired");
    }

    return refreshTokenDoc;
  }

  public async revokeRefreshTokenByToken(
    refreshToken: string,
  ): Promise<RefreshTokenDocument> {
    if (!refreshToken) {
      this._logger.error("A valid refresh token is required");
      throw new BadRequestException("A valid refresh token is required");
    }

    const refreshTokenDoc = await this._refreshToken
      .findOneAndUpdate(
        {
          token: refreshToken,
          expiresAt: { $gt: new Date() },
        },
        {
          expiresAt: new Date(),
        },
        {
          new: true,
        },
      )
      .exec();

    if (!refreshTokenDoc) {
      this._logger.error("Refresh token is invalid or expired");
      throw new BadRequestException("Refresh token is invalid or expired");
    }

    return refreshTokenDoc;
  }
}
