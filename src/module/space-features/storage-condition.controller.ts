import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthUserId } from "../auth/decorator/auth-user-id.decorator";
import { DocIdQueryDto } from "../common/dto/doc-id-query.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { RequiredRoles } from "../user/decorator/roles.decorator";
import { UserRole } from "../user/enum/user-role.enum";
import { CreateSpaceFeatureDto } from "./dto/create-space-feature.dto";
import { StorageConditionService } from "./storage-condition.service";

@ApiTags("Storage Condition Features")
@Controller("StorageConditionFeature")
export class StorageConditionController {
  constructor(
    private readonly _storageConditionService: StorageConditionService,
  ) {}

  @Post("Create")
  @ApiBody({ type: CreateSpaceFeatureDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  @RequiredRoles([UserRole.ADMIN])
  create(
    @AuthUserId() { userId }: ITokenPayload,
    @Body() createSpaceFeatureDto: CreateSpaceFeatureDto,
  ) {
    return this._storageConditionService.create(createSpaceFeatureDto, userId);
  }

  @Get("GetAll")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  findAll() {
    return this._storageConditionService.findAll();
  }

  @Delete("DeleteById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  @RequiredRoles([UserRole.ADMIN])
  remove(@Param() { DocId }: DocIdQueryDto) {
    return this._storageConditionService.remove(DocId);
  }
}
