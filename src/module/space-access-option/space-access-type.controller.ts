import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthUserId } from "../auth/decorator/auth-user-id.decorator";
import { DocIdQueryDto } from "../common/dto/doc-id-query.dto";
import { PaginatedResponseDto } from "../common/dto/paginated-response.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { RequiredRoles } from "../user/decorator/roles.decorator";
import { UserRoleEnum } from "../user/enum/user-role.enum";
import { CreateSpaceAccessTypeDto } from "./dto/create-space-access-type.dto";
import { ListSpaceAccessTypeQuery } from "./dto/list-space-access-type-query.dto";
import { UpdateSpaceAccessTypeDto } from "./dto/update-space-access-type.dto";
import { SpaceAccessTypeService } from "./space-access-type.service";

@ApiTags("Space Access Type")
@Controller("SpaceAccessType")
export class SpaceAccessTypeController {
  constructor(
    private readonly _spaceAccessTypeService: SpaceAccessTypeService,
  ) {}

  @Post("Create")
  @ApiBody({ type: CreateSpaceAccessTypeDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  @RequiredRoles([UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN])
  create(
    @AuthUserId() { userId }: ITokenPayload,
    @Body() createSpaceAccessTypeDto: CreateSpaceAccessTypeDto,
  ) {
    return this._spaceAccessTypeService.create(
      createSpaceAccessTypeDto,
      userId,
    );
  }

  @Get("GetAll")
  @ApiResponse({
    status: 200,
    type: PaginatedResponseDto,
  })
  findAll(@Query() spaceTypeListQuery: ListSpaceAccessTypeQuery) {
    return this._spaceAccessTypeService.findAll(spaceTypeListQuery);
  }

  @Get("GetById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  findOne(@Param() { DocId }: DocIdQueryDto) {
    return this._spaceAccessTypeService.findOne(DocId);
  }

  @Patch("UpdateById/:DocId")
  @ApiBody({ type: UpdateSpaceAccessTypeDto })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  @RequiredRoles([UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN])
  update(
    @Param() { DocId }: DocIdQueryDto,
    @AuthUserId() { userId }: ITokenPayload,
    @Body() updateSpaceAccessTypeDto: UpdateSpaceAccessTypeDto,
  ) {
    return this._spaceAccessTypeService.update(
      DocId,
      updateSpaceAccessTypeDto,
      userId,
    );
  }

  @Delete("DeleteById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  @RequiredRoles([UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN])
  remove(@Param() { DocId }: DocIdQueryDto) {
    return this._spaceAccessTypeService.remove(DocId);
  }
}
