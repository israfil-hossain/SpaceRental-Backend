import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { UserId } from "./decorator/user-id.decorator";
import { SignInDto } from "./dto/sign-in.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { TokenRefreshDto } from "./dto/token-refresh.dto";
import { IsPublic } from "./guard/auth.guard";

@ApiTags("Authentication")
@Controller("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("GetLoggedInUser")
  getLoggedInUser(@UserId() userId: string) {
    return this.authService.getLoggedInUser(userId);
  }

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
}
