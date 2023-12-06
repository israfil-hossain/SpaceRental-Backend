import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { EncryptionModule } from "../encryption/encryption.module";
import { UserModel, UserSchema } from "./entities/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: UserModel.name, schema: UserSchema }]),
    EncryptionModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
