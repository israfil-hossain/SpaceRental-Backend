import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/mongoose";
import * as base64url from "base64url";
import * as bcrypt from "bcrypt";
import * as uuid from "uuid";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { UserService } from "../user/user.service";
import { TokenResponseDto } from "./dto/token-response.dto";
import {
  RefreshToken,
  RefreshTokenModelType,
} from "./entities/refresh-token.entity";

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger("AuthService");
  private readonly saltRounds: number = 10;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: RefreshTokenModelType,
  ) {}

  async signIn(email: string, pass: string): Promise<SuccessResponseDto> {
    const user = await this.userService.getUserByEmail(email);
    if (!user || !(await this.verifyPassword(pass, user.password))) {
      throw new UnauthorizedException("Invalid credentials provided");
    }

    const payload = { sub: user._id.toString() };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.createRefreshTokenWithUserId(
      user._id.toString(),
    );

    const tokenDto = new TokenResponseDto(accessToken, refreshToken);

    return new SuccessResponseDto("Authenticated successfully", tokenDto);
  }

  async signUp(email: string, pass: string): Promise<SuccessResponseDto> {
    const password = await this.hashPassword(pass);

    const newUser = await this.userService.createUserWithEmailPassword(
      email,
      password,
    );

    const accessToken = await this.generateAccessToken(newUser._id.toString());
    const refreshToken = await this.createRefreshTokenWithUserId(
      newUser._id.toString(),
    );
    const tokenDto = new TokenResponseDto(accessToken, refreshToken);

    return new SuccessResponseDto("Authenticated successfully", tokenDto);
  }

  async refreshAccessToken(refreshToken: string): Promise<SuccessResponseDto> {
    const refreshTokenDoc = await this.refreshTokenModel.findOne({
      token: refreshToken,
      expiresAt: { $gt: new Date() },
    });

    if (!refreshTokenDoc) {
      throw new BadRequestException("Refresh token is invalid or expired");
    }

    const accessToken = await this.generateAccessToken(
      refreshTokenDoc.user.toString(),
    );
    const tokenDto = new TokenResponseDto(accessToken, refreshToken);

    return new SuccessResponseDto("Authenticated successfully", tokenDto);
  }

  //#region Private Services
  private async hashPassword(rawPassword: string): Promise<string> {
    return await bcrypt.hash(rawPassword, this.saltRounds);
  }

  private async verifyPassword(
    rawPassword: string = "",
    hashedPassword: string = "",
  ): Promise<boolean> {
    return await bcrypt.compare(rawPassword, hashedPassword);
  }

  private async generateAccessToken(userId: string) {
    return await this.jwtService.signAsync({ sid: userId });
  }

  private async createRefreshTokenWithUserId(userId: string): Promise<string> {
    try {
      const token = base64url.default(
        Buffer.from(uuid.v4().replace(/-/g, ""), "hex"),
      );

      const refreshToken = await this.refreshTokenModel.create({
        token,
        user: userId,
      });

      await refreshToken.save();
      return refreshToken.token;
    } catch (error) {
      this.logger.log("Error generating token", error);
      throw new InternalServerErrorException("Error generating token");
    }
  }
  //#endregion
}
