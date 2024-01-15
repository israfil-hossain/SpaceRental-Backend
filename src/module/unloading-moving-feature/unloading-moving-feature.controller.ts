import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthUserId } from "../auth/decorator/auth-user-id.decorator";
import { DocIdQueryDto } from "../common/dto/doc-id-query.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { RequiredRoles } from "../user/decorator/roles.decorator";
import { UserRoleEnum } from "../user/enum/user-role.enum";
import { CreateUnloadingMovingFeatureDto } from "./dto/create-unloading-moving-feature.dto";
import { UnloadingMovingFeatureService } from "./unloading-moving-feature.service";

@ApiTags("Unloading Moving Features")
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
  @RequiredRoles([UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN])
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
  @RequiredRoles([UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN])
  remove(@Param() { DocId }: DocIdQueryDto) {
    return this._unloadingMovingFeatureService.remove(DocId);
  }
}
