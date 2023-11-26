import { Module } from "@nestjs/common";
import { AuthModule } from "./module/auth/auth.module";
import { ConfigurationModule } from "./module/configuration/configuration.module";
import { UserModule } from "./module/user/user.module";

@Module({
  imports: [ConfigurationModule, UserModule, AuthModule],
})
export class AppModule {}
