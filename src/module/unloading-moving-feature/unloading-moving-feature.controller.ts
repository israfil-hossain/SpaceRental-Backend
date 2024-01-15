import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RequiredRoles } from "../application-user/decorator/roles.decorator";
import { ApplicationUserRoleEnum } from "../application-user/enum/application-user-role.enum";
import { AuthUserId } from "../auth/decorator/auth-user-id.decorator";
import { DocIdQueryDto } from "../common/dto/doc-id-query.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateUnloadingMovingFeatureDto } from "./dto/create-unloading-moving-feature.dto";
import { UnloadingMovingFeatureService } from "./unloading-moving-feature.service";

@ApiTags("Space - Unloading and Moving")
@Controller("unloading-moving-feature")
export class UnloadingMovingFeatureController {
  constructor(
    private readonly _unloadingMovingFeatureService: UnloadingMovingFeatureService,
  ) {}

  @Post("Create")
  @ApiBody({ type: CreateUnloadingMovingFeatureDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  @RequiredRoles([
    ApplicationUserRoleEnum.SUPER_ADMIN,
    ApplicationUserRoleEnum.ADMIN,
  ])
  create(
    @AuthUserId() { userId }: ITokenPayload,
    @Body() createSpaceFeatureDto: CreateUnloadingMovingFeatureDto,
  ) {
    return this._unloadingMovingFeatureService.create(
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
    return this._unloadingMovingFeatureService.findAll();
  }

  @Delete("DeleteById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  @RequiredRoles([
    ApplicationUserRoleEnum.SUPER_ADMIN,
    ApplicationUserRoleEnum.ADMIN,
  ])
  remove(@Param() { DocId }: DocIdQueryDto) {
    return this._unloadingMovingFeatureService.remove(DocId);
  }
}
