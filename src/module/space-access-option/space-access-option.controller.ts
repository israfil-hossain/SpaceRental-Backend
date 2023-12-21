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
import { UserRole } from "../user/enum/user-role.enum";
import { CreateSpaceAccessOptionDto } from "./dto/create-space-access-option.dto";
import { ListSpaceAccessOptionQuery } from "./dto/list-space-access-option-query.dto";
import { UpdateSpaceAccessOptionDto } from "./dto/update-space-access-option.dto";
import { SpaceAccessOptionService } from "./space-access-option.service";

@ApiTags("Space Access Option")
@Controller("SpaceAccessOption")
export class SpaceAccessOptionController {
  constructor(
    private readonly _spaceAccessOptionService: SpaceAccessOptionService,
  ) {}

  @Post("Create")
  @ApiBody({ type: CreateSpaceAccessOptionDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  @RequiredRoles([UserRole.ADMIN])
  create(
    @AuthUserId() { userId }: ITokenPayload,
    @Body() createSpaceAccessOptionDto: CreateSpaceAccessOptionDto,
  ) {
    return this._spaceAccessOptionService.create(
      createSpaceAccessOptionDto,
      userId,
    );
  }

  @Get("GetAll")
  @ApiResponse({
    status: 200,
    type: PaginatedResponseDto,
  })
  findAll(@Query() spaceTypeListQuery: ListSpaceAccessOptionQuery) {
    return this._spaceAccessOptionService.findAll(spaceTypeListQuery);
  }

  @Get("GetById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  findOne(@Param() { DocId }: DocIdQueryDto) {
    return this._spaceAccessOptionService.findOne(DocId);
  }

  @Patch("UpdateById/:DocId")
  @ApiBody({ type: UpdateSpaceAccessOptionDto })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  @RequiredRoles([UserRole.ADMIN])
  update(
    @Param() { DocId }: DocIdQueryDto,
    @AuthUserId() { userId }: ITokenPayload,
    @Body() updateSpaceAccessOptionDto: UpdateSpaceAccessOptionDto,
  ) {
    return this._spaceAccessOptionService.update(
      DocId,
      updateSpaceAccessOptionDto,
      userId,
    );
  }

  @Delete("DeleteById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  @RequiredRoles([UserRole.ADMIN])
  remove(@Param() { DocId }: DocIdQueryDto) {
    return this._spaceAccessOptionService.remove(DocId);
  }
}
