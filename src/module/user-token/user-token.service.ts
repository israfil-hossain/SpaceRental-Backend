import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as base64url from "base64url";
import * as uuid from "uuid";
import { ApplicationUser } from "../application-user/entities/application-user.entity";
import {
  ApplicationUserRoleDtoEnum,
  ApplicationUserRoleEnum,
} from "../application-user/enum/application-user-role.enum";
import { RefreshTokenDocument } from "./entities/refresh-token.entity";
import { RefreshTokenRepository } from "./repository/refresh-token.repository";

@Injectable()
export class UserTokenService {
  private readonly _logger: Logger = new Logger(UserTokenService.name);

  constructor(
    private readonly _refreshTokenRepository: RefreshTokenRepository,
    private readonly _jwtService: JwtService,
  ) {}

  public async generateAccessToken(
    userId: string,
    userRole: ApplicationUserRoleEnum | ApplicationUserRoleDtoEnum,
  ) {
    const tokenPayload: ITokenPayload = {
      userId,
      userRole,
    };

    return await this._jwtService.signAsync(tokenPayload);
  }

  public async createRefreshToken(userId: string): Promise<string> {
    try {
      const token = base64url.default(
        Buffer.from(uuid.v4().replace(/-/g, ""), "hex"),
      );

      const refreshToken = await this._refreshTokenRepository.create({
        token,
        user: userId,
      });

      return refreshToken.token;
    } catch (error) {
      this._logger.error("Error generating token", error);
      throw new InternalServerErrorException("Error generating token");
    }
  }

  public async getRefreshToken(
    refreshToken: string,
  ): Promise<RefreshTokenDocument> {
    if (!refreshToken) {
      this._logger.error("A valid refresh token is required");
      throw new BadRequestException("A valid refresh token is required");
    }

    const refreshTokenDoc = await this._refreshTokenRepository.findOneWhere(
      {
        token: refreshToken,
        expiresAt: { $gt: new Date() },
      },
      {
        populate: [
          {
            path: "user",
            model: ApplicationUser.name,
            select: "id role",
          },
        ],
      },
    );

    if (!refreshTokenDoc) {
      this._logger.error("Refresh token is invalid or expired");
      throw new BadRequestException("Refresh token is invalid or expired");
    }

    return refreshTokenDoc;
  }

  public async revokeRefreshToken(
    refreshToken: string,
  ): Promise<RefreshTokenDocument> {
    if (!refreshToken) {
      this._logger.error("A valid refresh token is required");
      throw new BadRequestException("A valid refresh token is required");
    }

    const refreshTokenDoc = await this._refreshTokenRepository.findOneWhere({
      token: refreshToken,
      expiresAt: { $gt: new Date() },
    });

    if (!refreshTokenDoc) {
      this._logger.error(`Token is either invalid or expired: ${refreshToken}`);
      throw new BadRequestException(
        "Refresh token is either invalid or expired",
      );
    }

    await this._refreshTokenRepository.updateOneById(refreshTokenDoc.id, {
      expiresAt: new Date(),
    });

    if (!refreshTokenDoc) {
      this._logger.error("Refresh token is invalid or expired");
      throw new BadRequestException("Refresh token is invalid or expired");
    }

    return refreshTokenDoc;
  }
}
