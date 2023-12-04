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
  RefreshToken,
  RefreshTokenDocument,
  RefreshTokenModelType,
} from "./entities/refresh-token.entity";

@Injectable()
export class TokenService {
  private readonly _logger: Logger = new Logger(TokenService.name);

  constructor(
    private _jwtService: JwtService,
    @InjectModel(RefreshToken.name)
    private _refreshTokenModel: RefreshTokenModelType,
  ) {}

  public async generateAccessToken(userId: string) {
    return await this._jwtService.signAsync({ sid: userId });
  }

  public async createRefreshTokenWithUserId(userId: string): Promise<string> {
    try {
      const token = base64url.default(
        Buffer.from(uuid.v4().replace(/-/g, ""), "hex"),
      );

      const refreshToken = await this._refreshTokenModel.create({
        token,
        user: userId,
      });

      await refreshToken.save();
      return refreshToken.token;
    } catch (error) {
      this._logger.log("Error generating token", error);
      throw new InternalServerErrorException("Error generating token");
    }
  }

  public async getRefreshTokenByToken(
    refreshToken: string,
  ): Promise<RefreshTokenDocument> {
    if (!refreshToken) {
      throw new BadRequestException("A valid refresh token is required");
    }

    const refreshTokenDoc = await this._refreshTokenModel.findOne({
      token: refreshToken,
      expiresAt: { $gt: new Date() },
    });

    if (!refreshTokenDoc) {
      throw new BadRequestException("Refresh token is invalid or expired");
    }

    return refreshTokenDoc;
  }
}
