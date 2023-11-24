import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { UserModule } from "./module/user/user.module";

@Module({
  imports: [
    // --------------------//
    // Env Configurations //
    // --------------------//
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // -------------------------//
    // Database Configurations //
    // -------------------------//
    MongooseModule.forRoot("mongodb://localhost:27017/space-rental"),
    // ---------------------//
    // Application Modules //
    // ---------------------//
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
