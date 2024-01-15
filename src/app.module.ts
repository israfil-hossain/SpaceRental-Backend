import { Module } from "@nestjs/common";
import { AuthModule } from "./module/auth/auth.module";
import { CommonModule } from "./module/common/common.module";
import { EmailModule } from "./module/email/email.module";
import { EncryptionModule } from "./module/encryption/encryption.module";
import { ImageMetaModule } from "./module/image-meta/image-meta.module";
import { SpaceAccessTypeModule } from "./module/space-access-type/space-access-type.module";
import { SpaceForRentModule } from "./module/space-for-rent/space-for-rent.module";
import { SpaceReviewModule } from "./module/space-review/space-review.module";
import { SpaceScheduleFeatureModule } from "./module/space-schedule-feature/space-schedule-feature.module";
import { SpaceSecurityFeatureModule } from "./module/space-security-feature/space-security-feature.module";
import { SpaceTypeModule } from "./module/space-type/space-type.module";
import { StorageConditionFeatureModule } from "./module/storage-condition-feature/storage-condition-feature.module";
import { TokenModule } from "./module/token/token.module";
import { UnloadingMovingFeatureModule } from "./module/unloading-moving-feature/unloading-moving-feature.module";
import { UserModule } from "./module/user/user.module";
import { ValidationProvider } from "./utility/provider/validation.provider";

@Module({
  imports: [
    CommonModule,
    TokenModule,
    EncryptionModule,
    AuthModule,
    UserModule,
    ImageMetaModule,
    SpaceTypeModule,
    SpaceAccessTypeModule,
    SpaceForRentModule,
    SpaceReviewModule,
    EmailModule,
    SpaceScheduleFeatureModule,
    SpaceSecurityFeatureModule,
    StorageConditionFeatureModule,
    UnloadingMovingFeatureModule,
  ],
  providers: [ValidationProvider],
})
export class AppModule {}
