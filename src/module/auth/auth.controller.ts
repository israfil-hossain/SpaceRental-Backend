import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { AuthService } from "./auth.service";
import { AuthUserId } from "./decorator/auth-user-id.decorator";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { TokenRefreshDto } from "./dto/token-refresh.dto";
import { IsPublic } from "./guard/auth.guard";

@ApiTags("Authentication")
@Controller("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("SignUp")
  @IsPublic()
  @ApiBody({ type: SignUpDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post("SignIn")
  @IsPublic()
  @ApiBody({ type: SignInDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post("TokenRefresh")
  @IsPublic()
  @ApiBody({ type: TokenRefreshDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  tokenRefresh(@Body() tokenRefreshDto: TokenRefreshDto) {
    return this.authService.refreshAccessToken(tokenRefreshDto.refreshToken);
  }

  @Get("GetLoggedInUser")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  getLoggedInUser(@AuthUserId() userId: string) {
    return this.authService.getLoggedInUser(userId);
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
    return this.authService.changePassword(changePasswordDto, userId);
  }
}
