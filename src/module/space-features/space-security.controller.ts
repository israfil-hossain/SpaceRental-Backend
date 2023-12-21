import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthUserId } from "../auth/decorator/auth-user-id.decorator";
import { DocIdQueryDto } from "../common/dto/doc-id-query.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateSpaceFeatureDto } from "./dto/create-space-feature.dto";
import { SpaceSecurityService } from "./space-security.service";

@ApiTags("Space Security Features")
@Controller("SpaceSecurityFeature")
export class SpaceSecurityController {
  constructor(private readonly _spaceSecurityService: SpaceSecurityService) {}

  @Post("Create")
  @ApiBody({ type: CreateSpaceFeatureDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  create(
    @AuthUserId() { userId }: ITokenPayload,
    @Body() createSpaceFeatureDto: CreateSpaceFeatureDto,
  ) {
    return this._spaceSecurityService.create(createSpaceFeatureDto, userId);
  }

  @Get("GetAll")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  findAll() {
    return this._spaceSecurityService.findAll();
  }

  @Delete("DeleteById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  remove(@Param() { DocId }: DocIdQueryDto) {
    return this._spaceSecurityService.remove(DocId);
  }
}
