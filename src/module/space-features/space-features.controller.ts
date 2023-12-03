import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthUserId } from "../auth/decorator/auth-user-id.decorator";
import { DocIdQueryDto } from "../common/dto/doc-id-query.dto";
import { CreateSpaceFeatureDto } from "./dto/create-space-feature.dto";
import { SpaceFeaturesService } from "./space-features.service";

@ApiTags("Space Features")
@Controller("space-features")
export class SpaceFeaturesController {
  constructor(private readonly spaceFeaturesService: SpaceFeaturesService) {}

  //#region Storage Condition Feature Controller
  @Post("CreateStorageCondition")
  createStorageCondition(
    @AuthUserId() userId: string,
    @Body() createSpaceFeatureDto: CreateSpaceFeatureDto,
  ) {
    return this.spaceFeaturesService.createStorageCondition(
      createSpaceFeatureDto,
      userId,
    );
  }

  @Get("GetAllStorageCondition")
  findAllStorageCondition() {
    return this.spaceFeaturesService.findAllStorageCondition();
  }

  @Delete("DeleteStorageConditionById/:DocId")
  removeStorageCondition(@Param() { DocId }: DocIdQueryDto) {
    return this.spaceFeaturesService.removeStorageCondition(DocId);
  }
  //#endregion

  //#region Unloading and Moving Feature Controller
  @Post("CreateUnloadingMoving")
  createUnloadingMoving(
    @AuthUserId() userId: string,
    @Body() createSpaceFeatureDto: CreateSpaceFeatureDto,
  ) {
    return this.spaceFeaturesService.createUnloadingMoving(
      createSpaceFeatureDto,
      userId,
    );
  }

  @Get("GetAllUnloadingMoving")
  findAllUnloadingMoving() {
    return this.spaceFeaturesService.findAllUnloadingMoving();
  }

  @Delete("DeleteUnloadingMovingById/:DocId")
  removeUnloadingMoving(@Param() { DocId }: DocIdQueryDto) {
    return this.spaceFeaturesService.removeUnloadingMoving(DocId);
  }
  //#endregion

  //#region Space Security Feature Controller
  @Post("CreateSpaceSecurity")
  createSpaceSecurity(
    @AuthUserId() userId: string,
    @Body() createSpaceFeatureDto: CreateSpaceFeatureDto,
  ) {
    return this.spaceFeaturesService.createSpaceSecurity(
      createSpaceFeatureDto,
      userId,
    );
  }

  @Get("GetAllSpaceSecurity")
  findAllSpaceSecurity() {
    return this.spaceFeaturesService.findAllSpaceSecurity();
  }

  @Delete("DeleteSpaceSecurityById/:DocId")
  removeSpaceSecurity(@Param() { DocId }: DocIdQueryDto) {
    return this.spaceFeaturesService.removeSpaceSecurity(DocId);
  }
  //#endregion

  //#region Space Schedule Feature Controller
  @Post("CreateSpaceSchedule")
  createSpaceSchedule(
    @AuthUserId() userId: string,
    @Body() createSpaceFeatureDto: CreateSpaceFeatureDto,
  ) {
    return this.spaceFeaturesService.createSpaceSchedule(
      createSpaceFeatureDto,
      userId,
    );
  }

  @Get("GetAllSpaceSchedule")
  findAllSpaceSchedule() {
    return this.spaceFeaturesService.findAllSpaceSchedule();
  }

  @Delete("DeleteSpaceScheduleById/:DocId")
  removeSpaceSchedule(@Param() { DocId }: DocIdQueryDto) {
    return this.spaceFeaturesService.removeSpaceSchedule(DocId);
  }
  //#endregion
}
