import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiBody, ApiResponse } from "@nestjs/swagger";
import { AuthUserId } from "../auth/decorator/auth-user-id.decorator";
import { DocIdQueryDto } from "../common/dto/doc-id-query.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { RequiredRoles } from "../user/decorator/roles.decorator";
import { UserRoleEnum } from "../user/enum/user-role.enum";
import { CreateSpaceSecurityFeatureDto } from "./dto/create-space-security-feature.dto";
import { SpaceSecurityFeatureService } from "./space-security-feature.service";

@Controller("space-security-feature")
export class SpaceSecurityFeatureController {
  constructor(
    private readonly _spaceSecurityFeatureService: SpaceSecurityFeatureService,
  ) {}

  @Post("Create")
  @ApiBody({ type: CreateSpaceSecurityFeatureDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  @RequiredRoles([UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN])
  create(
    @AuthUserId() { userId }: ITokenPayload,
    @Body() createSpaceFeatureDto: CreateSpaceSecurityFeatureDto,
  ) {
    return this._spaceSecurityFeatureService.create(
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
    return this._spaceSecurityFeatureService.findAll();
  }

  @Delete("DeleteById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  @RequiredRoles([UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN])
  remove(@Param() { DocId }: DocIdQueryDto) {
    return this._spaceSecurityFeatureService.remove(DocId);
  }
}
