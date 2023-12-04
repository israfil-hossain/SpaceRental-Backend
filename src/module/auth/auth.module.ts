import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { jwtConfig } from "../../config/jwt.config";
import { EncryptionModule } from "../encryption/encryption.module";
import { TokenModule } from "../token/token.module";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthGuardProvider } from "./guard/auth.guard";

@Module({
  imports: [
    ConfigModule,
    UserModule,
    TokenModule,
    EncryptionModule,
    JwtModule.registerAsync(jwtConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuardProvider],
})
export class AuthModule {}
