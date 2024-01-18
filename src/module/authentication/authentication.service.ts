import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as base64url from "base64url";
import * as uuid from "uuid";
import { ApplicationUserDocument } from "../application-user/entities/application-user.entity";
import { ApplicationUserRoleEnum } from "../application-user/enum/application-user-role.enum";
import { ApplicationUserRepository } from "../application-user/repository/application-user.repository";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { EmailService } from "../email/email.service";
import { EncryptionService } from "../encryption/encryption.service";
import { AdminSignInDto } from "./dto/admin-sign-in.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { TokenResponseDto } from "./dto/token-response.dto";
import { RefreshTokenDocument } from "./entities/refresh-token.entity";
import { RefreshTokenRepository } from "./repository/refresh-token.repository";

@Injectable()
export class AuthenticationService {
  private readonly _logger: Logger = new Logger(AuthenticationService.name);

  constructor(
    private readonly _applicationUserRepository: ApplicationUserRepository,
    private readonly _refreshTokenRepository: RefreshTokenRepository,

    private readonly _jwtService: JwtService,
    private readonly _encryptionService: EncryptionService,
    private readonly _mailService: EmailService,
  ) {}

  async adminSignIn(
    adminSignInDto: AdminSignInDto,
  ): Promise<SuccessResponseDto> {
    const user = await this._applicationUserRepository.findOneWhere({
      email: adminSignInDto.email,
      role:
        ApplicationUserRoleEnum.SUPER_ADMIN || ApplicationUserRoleEnum.ADMIN,
    });

    if (!user) {
      throw new NotFoundException(
        `No admin found with email: ${adminSignInDto.email}`,
      );
    }

    if (
      !(await this._encryptionService.verifyPassword(
        adminSignInDto.password,
        user.password,
      ))
    ) {
      this._logger.error(
        `Invalid credentials provided with email: ${adminSignInDto.email}`,
      );
      throw new UnauthorizedException("Invalid credentials provided");
    }

    if (user.isPasswordLess) {
      this._logger.error(
        `Password-less login attempted with email: ${adminSignInDto.email}`,
      );
      throw new BadRequestException(
        "To enable password-based login, please set up a password for your account alongside social login.",
      );
    }

    const accessToken = await this._generateAccessToken(
      user?.id?.toString(),
      user?.role,
    );
    const refreshToken = await this._createRefreshToken(user?.id?.toString());

    user.lastLogin = new Date();
    await user.save();

    const tokenDto = new TokenResponseDto(accessToken, refreshToken);
    this._mailService.sendUserSigninMail(user.email, user.fullName ?? "");

    return new SuccessResponseDto("Authenticated successfully", tokenDto);
  }

  async signIn(signInDto: SignInDto): Promise<SuccessResponseDto> {
    const user = await this._applicationUserRepository.findOneWhere({
      email: signInDto.email,
      role: signInDto.role,
    });

    if (!user) {
      throw new NotFoundException(
        `No user found with email: ${signInDto.email}`,
      );
    }
    if (
      !(await this._encryptionService.verifyPassword(
        signInDto.password,
        user.password,
      ))
    ) {
      this._logger.error(
        `Invalid credentials provided with email: ${signInDto.email}`,
      );
      throw new UnauthorizedException("Invalid credentials provided");
    }

    if (user.isPasswordLess) {
      this._logger.error(
        `Password-less login attempted with email: ${signInDto.email}`,
      );
      throw new BadRequestException(
        "To enable password-based login, please set up a password for your account alongside social login.",
      );
    }

    const accessToken = await this._generateAccessToken(
      user?.id?.toString(),
      user?.role,
    );
    const refreshToken = await this._createRefreshToken(user?.id?.toString());

    user.lastLogin = new Date();
    await user.save();

    const tokenDto = new TokenResponseDto(accessToken, refreshToken);
    this._mailService.sendUserSigninMail(user.email, user.fullName ?? "");

    return new SuccessResponseDto("Authenticated successfully", tokenDto);
  }

  async signUp(signupDto: SignUpDto): Promise<SuccessResponseDto> {
    signupDto.password = await this._encryptionService.hashPassword(
      signupDto.password,
    );

    const newUser = await this._applicationUserRepository.create(signupDto);

    const accessToken = await this._generateAccessToken(
      newUser?.id?.toString(),
      newUser?.role,
    );
    const refreshToken = await this._createRefreshToken(
      newUser?.id?.toString(),
    );

    const tokenDto = new TokenResponseDto(accessToken, refreshToken);
    this._mailService.sendUserSignupMail(newUser.email, newUser.fullName ?? "");

    return new SuccessResponseDto("Authenticated successfully", tokenDto);
  }

  async refreshAccessToken(refreshToken: string): Promise<SuccessResponseDto> {
    const userData = await this._getRefreshTokenUserIfValid(refreshToken);

    const accessToken = await this._generateAccessToken(
      userData._id.toString(),
      userData.role,
    );

    const tokenDto = new TokenResponseDto(accessToken, refreshToken);

    return new SuccessResponseDto("Authenticated successfully", tokenDto);
  }

  async revokeRefreshToken(refreshToken: string): Promise<SuccessResponseDto> {
    await this._revokeRefreshTokenIfValid(refreshToken);

    return new SuccessResponseDto("Refresh token revoked successfully");
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    if (changePasswordDto.oldPassword === changePasswordDto.newPassword) {
      this._logger.error(
        `User ${userId} tried to change password with the same old and new password`,
      );
      throw new BadRequestException(
        "Old Password and New Password cannot be the same",
      );
    }

    const user = await this._applicationUserRepository.findById(userId);

    if (!user) {
      throw new NotFoundException(`No user found with id: ${userId}`);
    }

    if (
      !(await this._encryptionService.verifyPassword(
        changePasswordDto.oldPassword,
        user.password,
      ))
    ) {
      this._logger.error(
        `User ${userId} tried to change password with an incorrect old password`,
      );
      throw new BadRequestException("Old Password is incorrect");
    }

    const hashedPassword = await this._encryptionService.hashPassword(
      changePasswordDto.newPassword,
    );

    user.password = hashedPassword;
    await user.save();

    return new SuccessResponseDto("Password changed successfully");
  }

  async getLoggedInUser(userId: string): Promise<SuccessResponseDto> {
    const user = await this._applicationUserRepository.findById(userId, {
      populate: [
        {
          path: "profilePicture",
          select: "url",
          transform: (doc) => doc?.url,
        },
      ],
    });

    if (!user) {
      throw new NotFoundException(`No user found with id: ${userId}`);
    }

    return new SuccessResponseDto("Logged in user found", user);
  }

  // Private Helper Methods
  private async _generateAccessToken(userId: string, userRole: string) {
    const tokenPayload: ITokenPayload = {
      userId,
      userRole,
    };

    return await this._jwtService.signAsync(tokenPayload);
  }

  private async _createRefreshToken(userId: string): Promise<string> {
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

  private async _getRefreshTokenUserIfValid(
    refreshToken: string,
  ): Promise<ApplicationUserDocument> {
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
            select: "role",
          },
        ],
      },
    );

    if (!refreshTokenDoc) {
      this._logger.error("Refresh token is invalid or expired");
      throw new BadRequestException("Refresh token is invalid or expired");
    }

    return refreshTokenDoc?.user as unknown as ApplicationUserDocument;
  }

  private async _revokeRefreshTokenIfValid(
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
