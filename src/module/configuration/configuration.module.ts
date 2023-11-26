import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { mongooseConfig } from "src/config/mongoose.config";

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
  ],
})
export class ConfigurationModule {}
