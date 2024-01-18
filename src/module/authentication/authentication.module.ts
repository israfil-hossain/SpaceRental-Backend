import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { jwtConfig } from "../../config/jwt.config";
import { ApplicationUserModule } from "../application-user/application-user.module";
import { EncryptionModule } from "../encryption/encryption.module";
import { UserTokenModule } from "../user-token/user-token.module";
import { AuthenticationController } from "./authentication.controller";
import { AuthenticationService } from "./authentication.service";
import { AuthenticationGuardProvider } from "./provider/authentication-guard.provider";

@Module({
  imports: [
    ConfigModule,
    ApplicationUserModule,
    UserTokenModule,
    EncryptionModule,
    JwtModule.registerAsync(jwtConfig),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, AuthenticationGuardProvider],
})
export class AuthenticationModule {}
