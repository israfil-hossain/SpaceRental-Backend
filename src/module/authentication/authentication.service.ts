import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { ApplicationUserRoleEnum } from "../application-user/enum/application-user-role.enum";
import { ApplicationUserRepository } from "../application-user/repository/application-user.repository";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { EmailService } from "../email/email.service";
import { EncryptionService } from "../encryption/encryption.service";
import { UserTokenService } from "../user-token/user-token.service";
import { AdminSignInDto } from "./dto/admin-sign-in.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { TokenResponseDto } from "./dto/token-response.dto";

@Injectable()
export class AuthenticationService {
  private readonly _logger: Logger = new Logger(AuthenticationService.name);

  constructor(
    private _applicationUserRepository: ApplicationUserRepository,
    private _tokenService: UserTokenService,
    private _encryptionService: EncryptionService,
    private _mailService: EmailService,
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

    const accessToken = await this._tokenService.generateAccessToken(
      user?.id?.toString(),
      user?.role,
    );
    const refreshToken = await this._tokenService.createRefreshToken(
      user?.id?.toString(),
    );

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

    const accessToken = await this._tokenService.generateAccessToken(
      user?.id?.toString(),
      user?.role,
    );
    const refreshToken = await this._tokenService.createRefreshToken(
      user?.id?.toString(),
    );

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

    const accessToken = await this._tokenService.generateAccessToken(
      newUser?.id?.toString(),
      newUser?.role,
    );
    const refreshToken = await this._tokenService.createRefreshToken(
      newUser?.id?.toString(),
    );

    const tokenDto = new TokenResponseDto(accessToken, refreshToken);
    this._mailService.sendUserSignupMail(newUser.email, newUser.fullName ?? "");

    return new SuccessResponseDto("Authenticated successfully", tokenDto);
  }

  async refreshAccessToken(refreshToken: string): Promise<SuccessResponseDto> {
    const userData =
      await this._tokenService.getRefreshTokenUserIfValid(refreshToken);

    const accessToken = await this._tokenService.generateAccessToken(
      userData._id.toString(),
      userData.role,
    );

    const tokenDto = new TokenResponseDto(accessToken, refreshToken);

    return new SuccessResponseDto("Authenticated successfully", tokenDto);
  }

  async revokeRefreshToken(refreshToken: string): Promise<SuccessResponseDto> {
    await this._tokenService.revokeRefreshToken(refreshToken);

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
}
