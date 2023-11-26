import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { jwtConfig } from "../../config/jwt.config";
import { UserModule } from "../user/user.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthGuardProvider } from "./guard/auth.guard";

@Module({
  imports: [ConfigModule, UserModule, JwtModule.registerAsync(jwtConfig)],
  controllers: [AuthController],
  providers: [AuthService, AuthGuardProvider],
})
export class AuthModule {}
