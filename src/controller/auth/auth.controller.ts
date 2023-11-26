import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SignInDto } from "../../domain/dtos/auth/sign-in.dto";
import { AuthService } from "../../service/auth/auth.service";

@ApiTags("Authentication")
@Controller("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("Login")
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }
}
