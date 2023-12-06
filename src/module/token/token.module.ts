import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { jwtConfig } from "../../config/jwt.config";
import {
  RefreshTokenModel,
  RefreshTokenSchema,
} from "./entities/refresh-token.entity";
import { TokenService } from "./token.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RefreshTokenModel.name, schema: RefreshTokenSchema },
    ]),
    JwtModule.registerAsync(jwtConfig),
  ],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
