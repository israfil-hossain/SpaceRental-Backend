import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  SpaceSecurity,
  SpaceSecuritySchema,
} from "./entities/space-security.entity";
import { SpaceSecurityController } from "./space-security.controller";
import { SpaceSecurityRepository } from "./space-security.repository";
import { SpaceSecurityService } from "./space-security.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SpaceSecurity.name,
        schema: SpaceSecuritySchema,
      },
    ]),
  ],
  controllers: [SpaceSecurityController],
  providers: [SpaceSecurityService, SpaceSecurityRepository],
  exports: [SpaceSecurityRepository],
})
export class SpaceSecurityModule {}
