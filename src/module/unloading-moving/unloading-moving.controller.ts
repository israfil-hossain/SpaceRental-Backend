import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RequiredRoles } from "../application-user/decorator/roles.decorator";
import { ApplicationUserRoleEnum } from "../application-user/enum/application-user-role.enum";
import { AuthUserId } from "../authentication/decorator/auth-user-id.decorator";
import { DocIdQueryDto } from "../common/dto/doc-id-query.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateUnloadingMovingDto } from "./dto/create-unloading-moving.dto";
import { UnloadingMovingService } from "./unloading-moving.service";

@ApiTags("Space - Unloading and Moving")
@Controller("UnloadingAndMoving")
export class UnloadingMovingController {
  constructor(
    private readonly unloadingMovingService: UnloadingMovingService,
  ) {}

  @Post("Create")
  @ApiBody({ type: CreateUnloadingMovingDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  @RequiredRoles([ApplicationUserRoleEnum.ADMIN, ApplicationUserRoleEnum.AGENT])
  create(
    @AuthUserId() { userId }: ITokenPayload,
    @Body() createSpaceDto: CreateUnloadingMovingDto,
  ) {
    return this.unloadingMovingService.create(createSpaceDto, userId);
  }

  @Get("GetAll")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  findAll() {
    return this.unloadingMovingService.findAll();
  }

  @Delete("DeleteById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  @RequiredRoles([ApplicationUserRoleEnum.ADMIN, ApplicationUserRoleEnum.AGENT])
  remove(@Param() { DocId }: DocIdQueryDto) {
    return this.unloadingMovingService.remove(DocId);
  }
}
