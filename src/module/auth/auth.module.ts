import { Module } from "@nestjs/common";
import { UserModule } from "src/module/user/user.module";
import { AuthController } from "../../controller/auth/auth.controller";
import { AuthService } from "../../service/auth/auth.service";

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
