import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { UserService } from "../user/user.service";
import { TokenResponseDto } from "./dto/token-response.dto";

@Injectable()
export class AuthService {
  private readonly saltRounds: number = 10;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<SuccessResponseDto> {
    const user = await this.userService.getUserByEmail(email);
    if (!user || !(await this.verifyPassword(pass, user.password))) {
      throw new UnauthorizedException("Invalid credentials provided");
    }

    const payload = { sub: user._id.toString() };
    const accessToken = await this.jwtService.signAsync(payload);

    const tokenDto = new TokenResponseDto(accessToken, "");

    return new SuccessResponseDto("Authenticated successfully", tokenDto);
  }

  async signUp(email: string, pass: string): Promise<SuccessResponseDto> {
    const password = await this.hashPassword(pass);

    const newUser = await this.userService.createUserWithEmailPassword(
      email,
      password,
    );

    const accessToken = await this.generateAccessToken(newUser._id.toString());
    const tokenDto = new TokenResponseDto(accessToken, "");

    return new SuccessResponseDto("Authenticated successfully", tokenDto);
  }

  //#region Private Services
  private async hashPassword(rawPassword: string): Promise<string> {
    return await bcrypt.hash(rawPassword, this.saltRounds);
  }

  private async verifyPassword(
    rawPassword: string = "",
    hashedPassword: string = "",
  ): Promise<boolean> {
    return await bcrypt.compare(rawPassword, hashedPassword);
  }

  private async generateAccessToken(userId: string) {
    return await this.jwtService.signAsync({ sid: userId });
  }
  //#endregion
}
