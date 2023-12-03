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
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { TokenResponseDto } from "./dto/token-response.dto";
import {
  RefreshToken,
  RefreshTokenDocument,
  RefreshTokenModelType,
} from "./entities/refresh-token.entity";

@Injectable()
export class AuthService {
  private readonly saltRounds: number = 10;
  private readonly logger: Logger = new Logger("AuthService");

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: RefreshTokenModelType,
  ) {}

  public async getLoggedInUser(userId: string): Promise<SuccessResponseDto> {
    const user = await this.userService.getUserById(userId);

    return new SuccessResponseDto("Logged in user found", user);
  }

  async signIn(signInDto: SignInDto): Promise<SuccessResponseDto> {
    const user = await this.userService.getUserByEmailAndRole(
      signInDto.email,
      signInDto.role,
    );

    if (!(await this.verifyPassword(signInDto.password, user.password))) {
      throw new UnauthorizedException("Invalid credentials provided");
    }

    if (user.isPasswordLess) {
      throw new BadRequestException(
        "To enable password-based login, please set up a password for your account alongside social login.",
      );
    }

    const accessToken = await this.generateAccessToken(user?.id);
    const refreshToken = await this.createRefreshTokenWithUserId(
      user._id.toString(),
    );

    user.lastLogin = new Date();
    await user.save();

    const tokenDto = new TokenResponseDto(accessToken, refreshToken);

    return new SuccessResponseDto("Authenticated successfully", tokenDto);
  }

  async signUp({
    password,
    ...signupDto
  }: SignUpDto): Promise<SuccessResponseDto> {
    const hashedPassword = await this.hashPassword(password);
    const newUser = await this.userService.createUserFromService({
      ...signupDto,
      password: hashedPassword,
    });

    const accessToken = await this.generateAccessToken(newUser?.id);
    const refreshToken = await this.createRefreshTokenWithUserId(newUser?.id);
    const tokenDto = new TokenResponseDto(accessToken, refreshToken);

    return new SuccessResponseDto("Authenticated successfully", tokenDto);
  }

  async refreshAccessToken(refreshToken: string): Promise<SuccessResponseDto> {
    const refreshTokenDoc = await this.getRefreshTokenByToken(refreshToken);

    const accessToken = await this.generateAccessToken(
      refreshTokenDoc.user.toString(),
    );
    const tokenDto = new TokenResponseDto(accessToken, refreshToken);

    return new SuccessResponseDto("Authenticated successfully", tokenDto);
  }

  //#region Internal Private Services
  private async hashPassword(rawPassword: string): Promise<string> {
    if (!rawPassword) {
      throw new BadRequestException("Password is required");
    }

    return await bcrypt.hash(rawPassword, this.saltRounds);
  }

  private async verifyPassword(
    rawPassword: string = "",
    hashedPassword: string = "",
  ): Promise<boolean> {
    if (!rawPassword) {
      throw new BadRequestException("Password is required");
    }

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

  private async getRefreshTokenByToken(
    refreshToken: string,
  ): Promise<RefreshTokenDocument> {
    if (!refreshToken) {
      throw new BadRequestException("A valid refresh token is required");
    }

    const refreshTokenDoc = await this.refreshTokenModel.findOne({
      token: refreshToken,
      expiresAt: { $gt: new Date() },
    });

    if (!refreshTokenDoc) {
      throw new BadRequestException("Refresh token is invalid or expired");
    }

    return refreshTokenDoc;
  }
  //#endregion
}
