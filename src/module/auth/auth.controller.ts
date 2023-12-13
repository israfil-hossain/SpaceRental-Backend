import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { AuthService } from "./auth.service";
import { AuthUserId } from "./decorator/auth-user-id.decorator";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { UpdateProfilePictureDto } from "./dto/update-profile-picture.dto";
import { IsPublic } from "./guard/auth.guard";

@ApiTags("Authentication")
@Controller("Auth")
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post("SignUp")
  @IsPublic()
  @ApiBody({ type: SignUpDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  signUp(@Body() signUpDto: SignUpDto) {
    return this._authService.signUp(signUpDto);
  }

  @Post("SignIn")
  @IsPublic()
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  signIn(@Body() signInDto: SignInDto) {
    return this._authService.signIn(signInDto);
  }

  @Post("TokenRefresh")
  @IsPublic()
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  tokenRefresh(@Body() tokenRefreshDto: RefreshTokenDto) {
    return this._authService.refreshAccessToken(tokenRefreshDto.refreshToken);
  }

  @Post("TokenRevoke")
  @IsPublic()
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  tokenRevoke(@Body() tokenRefreshDto: RefreshTokenDto) {
    return this._authService.revokeRefreshToken(tokenRefreshDto.refreshToken);
  }

  @Post("ChangePassword")
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @AuthUserId() userId: string,
  ) {
    return this._authService.changePassword(changePasswordDto, userId);
  }

  @Get("GetLoggedInUser")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  getLoggedInUser(@AuthUserId() userId: string) {
    return this._authService.getLoggedInUser(userId);
  }

  @Patch("UpdateProfilePicture")
  @ApiBody({ type: UpdateProfilePictureDto })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("profilePicture"))
  updateProfilePicture(
    @AuthUserId() userId: string,
    @UploadedFile() profilePicture: Express.Multer.File,
    @Body() updateProfilePictureDto: UpdateProfilePictureDto,
  ) {
    updateProfilePictureDto.profilePicture = profilePicture;

    return this._authService.updateProfilePicture(
      updateProfilePictureDto,
      userId,
    );
  }
}
