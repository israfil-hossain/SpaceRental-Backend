import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthUserId } from "../auth/decorator/auth-user-id.decorator";
import { DocIdQueryDto } from "../common/dto/doc-id-query.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateSpaceFeatureDto } from "./dto/create-space-feature.dto";
import { SpaceScheduleService } from "./space-schedule.service";

@ApiTags("Space Schedule Features")
@Controller("SpaceScheduleFeatures")
export class SpaceScheduleController {
  constructor(private readonly _spaceScheduleService: SpaceScheduleService) {}

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
    return this._spaceScheduleService.createSpaceSchedule(
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
    return this._spaceScheduleService.findAllSpaceSchedule();
  }

  @Delete("DeleteSpaceScheduleById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  removeSpaceSchedule(@Param() { DocId }: DocIdQueryDto) {
    return this._spaceScheduleService.removeSpaceSchedule(DocId);
  }
}
