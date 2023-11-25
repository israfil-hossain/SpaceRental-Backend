import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { mongooseConfig } from "./config/mongoose.config";
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
    MongooseModule.forRootAsync(mongooseConfig),
    // ---------------------//
    // Application Modules //
    // ---------------------//
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
