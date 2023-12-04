import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthUserId } from "../auth/decorator/auth-user-id.decorator";
import { DocIdQueryDto } from "../common/dto/doc-id-query.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateSpaceFeatureDto } from "./dto/create-space-feature.dto";
import { UnloadingMovingService } from "./unloading-moving.service";

@ApiTags("Unloading Moving Features")
@Controller("UnloadingMovingFeatures")
export class UnloadingMovingController {
  constructor(
    private readonly _unloadingMovingService: UnloadingMovingService,
  ) {}

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
    return this._unloadingMovingService.createUnloadingMoving(
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
    return this._unloadingMovingService.findAllUnloadingMoving();
  }

  @Delete("DeleteUnloadingMovingById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  removeUnloadingMoving(@Param() { DocId }: DocIdQueryDto) {
    return this._unloadingMovingService.removeUnloadingMoving(DocId);
  }
}
