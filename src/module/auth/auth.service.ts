import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from "@nestjs/common";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { EncryptionService } from "../encryption/encryption.service";
import { TokenService } from "../token/token.service";
import { UserService } from "../user/user.service";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { TokenResponseDto } from "./dto/token-response.dto";

@Injectable()
export class AuthService {
  private readonly _logger: Logger = new Logger(AuthService.name);

  constructor(
    private _userService: UserService,
    private _tokenService: TokenService,
    private _encryptionService: EncryptionService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<SuccessResponseDto> {
    const user = await this._userService.getUserByEmailAndRole(
      signInDto.email,
      signInDto.role,
    );

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

    const accessToken = await this._tokenService.generateAccessToken(user?.id);
    const refreshToken = await this._tokenService.createRefreshTokenWithUserId(
      user._id.toString(),
    );

    user.lastLogin = new Date();
    await user.save();

    const tokenDto = new TokenResponseDto(accessToken, refreshToken);

    return new SuccessResponseDto("Authenticated successfully", tokenDto);
  }

  async signUp(signupDto: SignUpDto): Promise<SuccessResponseDto> {
    signupDto["password"] = await this._encryptionService.hashPassword(
      signupDto.password,
    );
    const newUser = await this._userService.createUserFromService(signupDto);

    const accessToken = await this._tokenService.generateAccessToken(
      newUser?.id,
    );
    const refreshToken = await this._tokenService.createRefreshTokenWithUserId(
      newUser?.id,
    );
    const tokenDto = new TokenResponseDto(accessToken, refreshToken);

    return new SuccessResponseDto("Authenticated successfully", tokenDto);
  }

  async refreshAccessToken(refreshToken: string): Promise<SuccessResponseDto> {
    const refreshTokenDoc =
      await this._tokenService.getRefreshTokenByToken(refreshToken);

    const accessToken = await this._tokenService.generateAccessToken(
      refreshTokenDoc.user.toString(),
    );
    const tokenDto = new TokenResponseDto(accessToken, refreshToken);

    return new SuccessResponseDto("Authenticated successfully", tokenDto);
  }

  public async getLoggedInUser(userId: string): Promise<SuccessResponseDto> {
    const user = await this._userService.getUserById(userId);

    return new SuccessResponseDto("Logged in user found", user);
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

    const user = await this._userService.getUserById(userId);

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
}
