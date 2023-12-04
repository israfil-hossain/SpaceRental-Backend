import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthUserId } from "../auth/decorator/auth-user-id.decorator";
import { DocIdQueryDto } from "../common/dto/doc-id-query.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateSpaceFeatureDto } from "./dto/create-space-feature.dto";
import { SpaceFeaturesService } from "./space-features.service";

@ApiTags("Space Features")
@Controller("SpaceFeatures")
export class SpaceFeaturesController {
  constructor(private readonly _spaceFeaturesService: SpaceFeaturesService) {}

  //#region Storage Condition Feature Controller
  @Post("CreateStorageCondition")
  @ApiBody({ type: CreateSpaceFeatureDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  createStorageCondition(
    @AuthUserId() userId: string,
    @Body() createSpaceFeatureDto: CreateSpaceFeatureDto,
  ) {
    return this._spaceFeaturesService.createStorageCondition(
      createSpaceFeatureDto,
      userId,
    );
  }

  @Get("GetAllStorageCondition")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  findAllStorageCondition() {
    return this._spaceFeaturesService.findAllStorageCondition();
  }

  @Delete("DeleteStorageConditionById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  removeStorageCondition(@Param() { DocId }: DocIdQueryDto) {
    return this._spaceFeaturesService.removeStorageCondition(DocId);
  }
  //#endregion

  //#region Unloading and Moving Feature Controller
  @Post("CreateUnloadingMoving")
  @ApiBody({ type: CreateSpaceFeatureDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  createUnloadingMoving(
    @AuthUserId() userId: string,
    @Body() createSpaceFeatureDto: CreateSpaceFeatureDto,
  ) {
    return this._spaceFeaturesService.createUnloadingMoving(
      createSpaceFeatureDto,
      userId,
    );
  }

  @Get("GetAllUnloadingMoving")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  findAllUnloadingMoving() {
    return this._spaceFeaturesService.findAllUnloadingMoving();
  }

  @Delete("DeleteUnloadingMovingById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  removeUnloadingMoving(@Param() { DocId }: DocIdQueryDto) {
    return this._spaceFeaturesService.removeUnloadingMoving(DocId);
  }
  //#endregion

  //#region Space Security Feature Controller
  @Post("CreateSpaceSecurity")
  @ApiBody({ type: CreateSpaceFeatureDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  createSpaceSecurity(
    @AuthUserId() userId: string,
    @Body() createSpaceFeatureDto: CreateSpaceFeatureDto,
  ) {
    return this._spaceFeaturesService.createSpaceSecurity(
      createSpaceFeatureDto,
      userId,
    );
  }

  @Get("GetAllSpaceSecurity")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  findAllSpaceSecurity() {
    return this._spaceFeaturesService.findAllSpaceSecurity();
  }

  @Delete("DeleteSpaceSecurityById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  removeSpaceSecurity(@Param() { DocId }: DocIdQueryDto) {
    return this._spaceFeaturesService.removeSpaceSecurity(DocId);
  }
  //#endregion

  //#region Space Schedule Feature Controller
  @Post("CreateSpaceSchedule")
  @ApiBody({ type: CreateSpaceFeatureDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  createSpaceSchedule(
    @AuthUserId() userId: string,
    @Body() createSpaceFeatureDto: CreateSpaceFeatureDto,
  ) {
    return this._spaceFeaturesService.createSpaceSchedule(
      createSpaceFeatureDto,
      userId,
    );
  }

  @Get("GetAllSpaceSchedule")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  findAllSpaceSchedule() {
    return this._spaceFeaturesService.findAllSpaceSchedule();
  }

  @Delete("DeleteSpaceScheduleById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  removeSpaceSchedule(@Param() { DocId }: DocIdQueryDto) {
    return this._spaceFeaturesService.removeSpaceSchedule(DocId);
  }
  //#endregion
}
