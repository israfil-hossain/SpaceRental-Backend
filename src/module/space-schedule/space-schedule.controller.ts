import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RequiredRoles } from "../application-user/decorator/roles.decorator";
import { ApplicationUserRoleEnum } from "../application-user/enum/application-user-role.enum";
import { AuthUserId } from "../authentication/decorator/auth-user-id.decorator";
import { DocIdQueryDto } from "../common/dto/doc-id-query.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateSpaceScheduleDto } from "./dto/create-space-schedule.dto";
import { SpaceScheduleService } from "./space-schedule.service";

@ApiTags("Space - Schedule")
@Controller("SpaceSchedule")
export class SpaceScheduleController {
  constructor(
    private readonly spaceScheduleFeatureService: SpaceScheduleService,
  ) {}

  @Post("Create")
  @ApiBody({ type: CreateSpaceScheduleDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  @RequiredRoles([ApplicationUserRoleEnum.ADMIN])
  create(
    @AuthUserId() { userId }: ITokenPayload,
    @Body() createSpaceFeatureDto: CreateSpaceScheduleDto,
  ) {
    return this.spaceScheduleFeatureService.create(
      createSpaceFeatureDto,
      userId,
    );
  }

  @Get("GetAll")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  findAll() {
    return this.spaceScheduleFeatureService.findAll();
  }

  @Delete("DeleteById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  @RequiredRoles([ApplicationUserRoleEnum.ADMIN])
  remove(@Param() { DocId }: DocIdQueryDto) {
    return this.spaceScheduleFeatureService.remove(DocId);
  }

  @Get("GetAllForDropdown")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  findAllForDropdown() {
    return this.spaceScheduleFeatureService.findAllForDropdown();
  }
}
