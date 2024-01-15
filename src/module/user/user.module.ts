import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EncryptionModule } from "../encryption/encryption.module";
import { ImageMetaModule } from "../image-meta/image-meta.module";
import { UserModel, UserSchema } from "./entities/user.entity";
import { RolesGuardProvider } from "./guards/roles.guard";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
    EncryptionModule,
    ImageMetaModule,
  ],
  controllers: [UserController],
  providers: [UserService, RolesGuardProvider],
  exports: [UserService],
})
export class UserModule {}
