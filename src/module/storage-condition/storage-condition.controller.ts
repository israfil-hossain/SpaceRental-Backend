import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RequiredRoles } from "../application-user/decorator/roles.decorator";
import { ApplicationUserRoleEnum } from "../application-user/enum/application-user-role.enum";
import { AuthUserId } from "../authentication/decorator/auth-user-id.decorator";
import { DocIdQueryDto } from "../common/dto/doc-id-query.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateStorageConditionDto } from "./dto/create-storage-condition.dto";
import { StorageConditionService } from "./storage-condition.service";

@ApiTags("Space - Storage Conditions")
@Controller("StorageCondition")
export class StorageConditionController {
  constructor(
    private readonly storageConditionService: StorageConditionService,
  ) {}

  @Post("Create")
  @ApiBody({ type: CreateStorageConditionDto })
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
    @Body() createSpaceDto: CreateStorageConditionDto,
  ) {
    return this.storageConditionService.create(createSpaceDto, userId);
  }

  @Get("GetAll")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  findAll() {
    return this.storageConditionService.findAll();
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
    return this.storageConditionService.remove(DocId);
  }
}
