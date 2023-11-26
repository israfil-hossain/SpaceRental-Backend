import { Module } from "@nestjs/common";
import { AuthModule } from "./module/auth/auth.module";
import { ConfigurationModule } from "./module/configuration/configuration.module";
import { UserModule } from "./module/user/user.module";
import { ValidationProvider } from "./utility/provider/validation.provider";

@Module({
  imports: [ConfigurationModule, UserModule, AuthModule],
  providers: [ValidationProvider],
})
export class AppModule {}
