import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class TokenRefreshDto {
  @ApiProperty({
    description: "Refresh token",
    example: "your_refresh_token_here",
  })
  @IsNotEmpty({ message: "Refresh token should not be empty" })
  readonly refreshToken: string;
}
