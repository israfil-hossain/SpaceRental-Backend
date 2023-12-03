import { Module } from "@nestjs/common";
import { AuthModule } from "./module/auth/auth.module";
import { CommonModule } from "./module/common/common.module";
import { SpaceTypeModule } from "./module/space-type/space-type.module";
import { UserModule } from "./module/user/user.module";
import { ValidationProvider } from "./utility/provider/validation.provider";

@Module({
  imports: [CommonModule, AuthModule, UserModule, SpaceTypeModule],
  providers: [ValidationProvider],
})
export class AppModule {}
