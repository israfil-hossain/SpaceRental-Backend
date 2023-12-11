import { Module } from "@nestjs/common";
import { AuthModule } from "./module/auth/auth.module";
import { CommonModule } from "./module/common/common.module";
import { EncryptionModule } from "./module/encryption/encryption.module";
import { SpaceAccessOptionModule } from "./module/space-access-option/space-access-option.module";
import { SpaceFeaturesModule } from "./module/space-features/space-features.module";
import { SpaceTypeModule } from "./module/space-type/space-type.module";
import { SpaceModule } from "./module/space/space.module";
import { TokenModule } from "./module/token/token.module";
import { UserModule } from "./module/user/user.module";
import { ValidationProvider } from "./utility/provider/validation.provider";

@Module({
  imports: [
    CommonModule,
    TokenModule,
    EncryptionModule,
    AuthModule,
    UserModule,
    SpaceTypeModule,
    SpaceAccessOptionModule,
    SpaceFeaturesModule,
    SpaceModule,
  ],
  providers: [ValidationProvider],
})
export class AppModule {}
