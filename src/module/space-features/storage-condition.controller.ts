import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthUserId } from "../auth/decorator/auth-user-id.decorator";
import { DocIdQueryDto } from "../common/dto/doc-id-query.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateSpaceFeatureDto } from "./dto/create-space-feature.dto";
import { StorageConditionService } from "./storage-condition.service";

@ApiTags("Storage Condition Features")
@Controller("StorageConditionFeatures")
export class StorageConditionController {
  constructor(
    private readonly _storageConditionService: StorageConditionService,
  ) {}

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
    return this._storageConditionService.createStorageCondition(
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
    return this._storageConditionService.findAllStorageCondition();
  }

  @Delete("DeleteStorageConditionById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  removeStorageCondition(@Param() { DocId }: DocIdQueryDto) {
    return this._storageConditionService.removeStorageCondition(DocId);
  }
}
