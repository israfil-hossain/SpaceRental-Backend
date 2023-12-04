import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthUserId } from "../auth/decorator/auth-user-id.decorator";
import { DocIdQueryDto } from "../common/dto/doc-id-query.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateSpaceFeatureDto } from "./dto/create-space-feature.dto";
import { SpaceSecurityService } from "./space-security.service";

@ApiTags("Space Security Features")
@Controller("SpaceSecurityFeatures")
export class SpaceSecurityController {
  constructor(private readonly _spaceSecurityService: SpaceSecurityService) {}

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
    return this._spaceSecurityService.createSpaceSecurity(
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
    return this._spaceSecurityService.findAllSpaceSecurity();
  }

  @Delete("DeleteSpaceSecurityById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  removeSpaceSecurity(@Param() { DocId }: DocIdQueryDto) {
    return this._spaceSecurityService.removeSpaceSecurity(DocId);
  }
}
