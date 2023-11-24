import { ConfigModule, ConfigService } from "@nestjs/config";
import {
  MongooseModuleAsyncOptions,
  MongooseModuleOptions,
} from "@nestjs/mongoose";

export const mongooseConfig: MongooseModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
  ): Promise<MongooseModuleOptions> => {
    switch (configService.get<string>("NODE_ENV")) {
      case "production":
        return {
          uri: configService.getOrThrow<string>("MONGO_URI"),
        };

      case "test":
        return {
          uri: "mongodb://localhost:27017/space-rental-test",
        };

      default:
        return {
          uri: "mongodb://localhost:27017/space-rental",
        };
    }
  },
};
