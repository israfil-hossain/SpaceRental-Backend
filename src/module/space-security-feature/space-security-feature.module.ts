import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import {
  SpaceSecurityFeature,
  SpaceSecurityFeatureSchema,
} from "./entities/space-security-feature.entity";
import { SpaceSecurityFeatureController } from "./space-security-feature.controller";
import { SpaceSecurityFeatureService } from "./space-security-feature.service";

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: SpaceSecurityFeature.name,
        schema: SpaceSecurityFeatureSchema,
      },
    ]),
  ],
  controllers: [SpaceSecurityFeatureController],
  providers: [SpaceSecurityFeatureService],
  exports: [SpaceSecurityFeatureService],
})
export class SpaceSecurityFeatureModule {}
