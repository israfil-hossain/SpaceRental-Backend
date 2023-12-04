import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthUserId } from "../auth/decorator/auth-user-id.decorator";
import { DocIdQueryDto } from "../common/dto/doc-id-query.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateSpaceFeatureDto } from "./dto/create-space-feature.dto";
import { SpaceScheduleService } from "./space-schedule.service";

@ApiTags("Space Schedule Features")
@Controller("SpaceScheduleFeature")
export class SpaceScheduleController {
  constructor(private readonly _spaceScheduleService: SpaceScheduleService) {}

  @Post("Create")
  @ApiBody({ type: CreateSpaceFeatureDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  create(
    @AuthUserId() userId: string,
    @Body() createSpaceFeatureDto: CreateSpaceFeatureDto,
  ) {
    return this._spaceScheduleService.create(createSpaceFeatureDto, userId);
  }

  @Get("GetAll")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  findAll() {
    return this._spaceScheduleService.findAll();
  }

  @Delete("DeleteById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  remove(@Param() { DocId }: DocIdQueryDto) {
    return this._spaceScheduleService.remove(DocId);
  }
}
