import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<SuccessResponseDto> {
    const user = await this.userService.getUserByEmail(email);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user._id.toString() };

    return new SuccessResponseDto("Authenticated successfully", {
      accessToken: await this.jwtService.signAsync(payload),
    });
  }
}
