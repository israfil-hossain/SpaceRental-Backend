import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiBody, ApiResponse } from "@nestjs/swagger";
import { AuthUserId } from "../auth/decorator/auth-user-id.decorator";
import { DocIdQueryDto } from "../common/dto/doc-id-query.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { RequiredRoles } from "../user/decorator/roles.decorator";
import { UserRoleEnum } from "../user/enum/user-role.enum";
import { CreateStorageConditionFeatureDto } from "./dto/create-storage-condition-feature.dto";
import { StorageConditionFeatureService } from "./storage-condition-feature.service";

@Controller("storage-condition-feature")
export class StorageConditionFeatureController {
  constructor(
    private readonly _storageConditionFeatureService: StorageConditionFeatureService,
  ) {}

  @Post("Create")
  @ApiBody({ type: CreateStorageConditionFeatureDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  @RequiredRoles([UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN])
  create(
    @AuthUserId() { userId }: ITokenPayload,
    @Body() createSpaceFeatureDto: CreateStorageConditionFeatureDto,
  ) {
    return this._storageConditionFeatureService.create(
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
    return this._storageConditionFeatureService.findAll();
  }

  @Delete("DeleteById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  @RequiredRoles([UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN])
  remove(@Param() { DocId }: DocIdQueryDto) {
    return this._storageConditionFeatureService.remove(DocId);
  }
}
