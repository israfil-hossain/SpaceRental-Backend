import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RequiredRoles } from "../application-user/decorator/roles.decorator";
import { ApplicationUserRoleEnum } from "../application-user/enum/application-user-role.enum";
import { AuthUserId } from "../authentication/decorator/auth-user-id.decorator";
import { DocIdQueryDto } from "../common/dto/doc-id-query.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateSpaceSecurityDto } from "./dto/create-space-security.dto";
import { SpaceSecurityService } from "./space-security.service";

@ApiTags("Space - Security")
@Controller("SpaceSecurity")
export class SpaceSecurityController {
  constructor(private readonly spaceSecurityService: SpaceSecurityService) {}

  @Post("Create")
  @ApiBody({ type: CreateSpaceSecurityDto })
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
    @Body() createSpaceDto: CreateSpaceSecurityDto,
  ) {
    return this.spaceSecurityService.create(createSpaceDto, userId);
  }

  @Get("GetAll")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  findAll() {
    return this.spaceSecurityService.findAll();
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
    return this.spaceSecurityService.remove(DocId);
  }
}
