import { Module } from "@nestjs/common";
import { ApplicationUserModule } from "./module/application-user/application-user.module";
import { AuthenticationModule } from "./module/authentication/authentication.module";
import { CommonModule } from "./module/common/common.module";
import { ConfigurationModule } from "./module/configuration/configuration.module";
import { EmailModule } from "./module/email/email.module";
import { EncryptionModule } from "./module/encryption/encryption.module";
import { ImageMetaModule } from "./module/image-meta/image-meta.module";
import { SpaceAccessTypeModule } from "./module/space-access-type/space-access-type.module";
import { SpaceForRentModule } from "./module/space-for-rent/space-for-rent.module";
import { SpaceReviewModule } from "./module/space-review/space-review.module";
import { SpaceScheduleModule } from "./module/space-schedule/space-schedule.module";
import { SpaceSecurityModule } from "./module/space-security/space-security.module";
import { SpaceTypeModule } from "./module/space-type/space-type.module";
import { StorageConditionModule } from "./module/storage-condition/storage-condition.module";
import { TermsConditionModule } from "./module/terms-condition/terms-condition.module";
import { UnloadingMovingModule } from "./module/unloading-moving/unloading-moving.module";
import { ValidationProvider } from "./utility/provider/validation.provider";

@Module({
  imports: [
    CommonModule,
    EncryptionModule,
    AuthenticationModule,
    ApplicationUserModule,
    ImageMetaModule,
    SpaceTypeModule,
    SpaceAccessTypeModule,
    SpaceForRentModule,
    SpaceReviewModule,
    EmailModule,
    SpaceScheduleModule,
    SpaceSecurityModule,
    StorageConditionModule,
    UnloadingMovingModule,
    TermsConditionModule,
    ConfigurationModule,
  ],
  providers: [ValidationProvider],
})
export class AppModule {}
