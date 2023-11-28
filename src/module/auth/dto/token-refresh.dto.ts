import { IsNotEmpty } from "class-validator";

export class TokenRefreshDto {
  @IsNotEmpty({ message: "Refresh token should not be empty" })
  readonly refreshToken: string;
}
