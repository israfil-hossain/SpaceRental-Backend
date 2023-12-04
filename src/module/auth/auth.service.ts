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
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private encryptionService: EncryptionService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<SuccessResponseDto> {
    const user = await this.userService.getUserByEmailAndRole(
      signInDto.email,
      signInDto.role,
    );

    if (
      !(await this.encryptionService.verifyPassword(
        signInDto.password,
        user.password,
      ))
    ) {
      this.logger.log(
        `Invalid credentials provided with email: ${signInDto.email}`,
      );
      throw new UnauthorizedException("Invalid credentials provided");
    }

    if (user.isPasswordLess) {
      throw new BadRequestException(
        "To enable password-based login, please set up a password for your account alongside social login.",
      );
    }

    const accessToken = await this.tokenService.generateAccessToken(user?.id);
    const refreshToken = await this.tokenService.createRefreshTokenWithUserId(
      user._id.toString(),
    );

    user.lastLogin = new Date();
    await user.save();

    const tokenDto = new TokenResponseDto(accessToken, refreshToken);

    return new SuccessResponseDto("Authenticated successfully", tokenDto);
  }

  async signUp(signupDto: SignUpDto): Promise<SuccessResponseDto> {
    signupDto["password"] = await this.encryptionService.hashPassword(
      signupDto.password,
    );
    const newUser = await this.userService.createUserFromService(signupDto);

    const accessToken = await this.tokenService.generateAccessToken(
      newUser?.id,
    );
    const refreshToken = await this.tokenService.createRefreshTokenWithUserId(
      newUser?.id,
    );
    const tokenDto = new TokenResponseDto(accessToken, refreshToken);

    return new SuccessResponseDto("Authenticated successfully", tokenDto);
  }

  async refreshAccessToken(refreshToken: string): Promise<SuccessResponseDto> {
    const refreshTokenDoc =
      await this.tokenService.getRefreshTokenByToken(refreshToken);

    const accessToken = await this.tokenService.generateAccessToken(
      refreshTokenDoc.user.toString(),
    );
    const tokenDto = new TokenResponseDto(accessToken, refreshToken);

    return new SuccessResponseDto("Authenticated successfully", tokenDto);
  }

  public async getLoggedInUser(userId: string): Promise<SuccessResponseDto> {
    const user = await this.userService.getUserById(userId);

    return new SuccessResponseDto("Logged in user found", user);
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    if (changePasswordDto.oldPassword === changePasswordDto.newPassword) {
      throw new BadRequestException(
        "Old Password and New Password cannot be the same",
      );
    }

    const user = await this.userService.getUserById(userId);

    if (
      !(await this.encryptionService.verifyPassword(
        changePasswordDto.oldPassword,
        user.password,
      ))
    ) {
      throw new BadRequestException("Old Password is incorrect");
    }

    const hashedPassword = await this.encryptionService.hashPassword(
      changePasswordDto.newPassword,
    );

    user.password = hashedPassword;
    await user.save();

    return new SuccessResponseDto("Password changed successfully");
  }
}
