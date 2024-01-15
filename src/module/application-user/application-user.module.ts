import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EncryptionModule } from "../encryption/encryption.module";
import { ImageMetaModule } from "../image-meta/image-meta.module";
import { ApplicationUserController } from "./application-user.controller";
import { ApplicationUserService } from "./application-user.service";
import {
  ApplicationUser,
  ApplicationUserSchema,
} from "./entities/application-user.entity";
import { RolesGuardProvider } from "./guards/application-user-roles.guard";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ApplicationUser.name, schema: ApplicationUserSchema },
    ]),
    EncryptionModule,
    ImageMetaModule,
  ],
  controllers: [ApplicationUserController],
  providers: [ApplicationUserService, RolesGuardProvider],
  exports: [ApplicationUserService],
})
export class ApplicationUserModule {}
