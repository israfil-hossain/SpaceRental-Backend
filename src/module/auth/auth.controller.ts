import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/sign-in.dto";

@ApiTags("Authentication")
@Controller("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("SignIn")
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }
}
