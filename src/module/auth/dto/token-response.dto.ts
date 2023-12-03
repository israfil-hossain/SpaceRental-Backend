import { ApiProperty } from "@nestjs/swagger";

export class TokenResponseDto {
  @ApiProperty({
    description: "Access token",
    example: "your_access_token_here",
  })
  accessToken: string;

  @ApiProperty({
    description: "Refresh token",
    example: "your_refresh_token_here",
  })
  refreshToken: string;

  constructor(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
