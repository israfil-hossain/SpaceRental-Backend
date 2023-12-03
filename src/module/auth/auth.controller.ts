import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
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
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto);
  }

  @Post("SignIn")
  @IsPublic()
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }

  @Post("TokenRefresh")
  @IsPublic()
  tokenRefresh(@Body() tokenRefreshDto: TokenRefreshDto) {
    return this.authService.refreshAccessToken(tokenRefreshDto.refreshToken);
  }

  @Get("GetLoggedInUser")
  getLoggedInUser(@AuthUserId() userId: string) {
    return this.authService.getLoggedInUser(userId);
  }

  @Post("ChangePassword")
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @AuthUserId() userId: string,
  ) {
    return this.authService.changePassword(changePasswordDto, userId);
  }
}
