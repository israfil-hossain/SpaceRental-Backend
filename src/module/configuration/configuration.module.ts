import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigurationController } from "./configuration.controller";
import { ConfigurationService } from "./configuration.service";
import {
  Configuration,
  ConfigurationSchema,
} from "./entities/configuration.entity";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Configuration.name, schema: ConfigurationSchema },
    ]),
  ],
  controllers: [ConfigurationController],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
