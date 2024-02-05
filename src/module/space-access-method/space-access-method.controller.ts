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
import { RequiredRoles } from "../application-user/decorator/roles.decorator";
import { ApplicationUserRoleEnum } from "../application-user/enum/application-user-role.enum";
import { AuthUserId } from "../authentication/decorator/auth-user-id.decorator";
import { DocIdQueryDto } from "../common/dto/doc-id-query.dto";
import { PaginatedResponseDto } from "../common/dto/paginated-response.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateSpaceAccessMethodDto } from "./dto/create-space-access-method.dto";
import { ListSpaceAccessMethodQuery } from "./dto/list-space-access-method-query.dto";
import { UpdateSpaceAccessMethodDto } from "./dto/update-space-access-method.dto";
import { SpaceAccessMethodService } from "./space-access-method.service";

@ApiTags("Space - Access Methods")
@Controller("SpaceAccessMethod")
export class SpaceAccessMethodController {
  constructor(
    private readonly spaceAccessMethodService: SpaceAccessMethodService,
  ) {}

  @Post("Create")
  @ApiBody({ type: CreateSpaceAccessMethodDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  @RequiredRoles([ApplicationUserRoleEnum.ADMIN, ApplicationUserRoleEnum.AGENT])
  create(
    @AuthUserId() { userId }: ITokenPayload,
    @Body() createSpaceAccessMethodDto: CreateSpaceAccessMethodDto,
  ) {
    return this.spaceAccessMethodService.create(
      createSpaceAccessMethodDto,
      userId,
    );
  }

  @Get("GetAll")
  @ApiResponse({
    status: 200,
    type: PaginatedResponseDto,
  })
  findAll(@Query() query: ListSpaceAccessMethodQuery) {
    return this.spaceAccessMethodService.findAll(query);
  }

  @Get("GetById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  findOne(@Param() { DocId }: DocIdQueryDto) {
    return this.spaceAccessMethodService.findOne(DocId);
  }

  @Patch("UpdateById/:DocId")
  @ApiBody({ type: UpdateSpaceAccessMethodDto })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  @RequiredRoles([ApplicationUserRoleEnum.ADMIN, ApplicationUserRoleEnum.AGENT])
  update(
    @Param() { DocId }: DocIdQueryDto,
    @AuthUserId() { userId }: ITokenPayload,
    @Body() updateDto: UpdateSpaceAccessMethodDto,
  ) {
    return this.spaceAccessMethodService.update(DocId, updateDto, userId);
  }

  @Delete("DeleteById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  @RequiredRoles([ApplicationUserRoleEnum.ADMIN, ApplicationUserRoleEnum.AGENT])
  remove(@Param() { DocId }: DocIdQueryDto) {
    return this.spaceAccessMethodService.remove(DocId);
  }

  @Get("GetAllForDropdown")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  findAllForDropdown() {
    return this.spaceAccessMethodService.findAllForDropdown();
  }
}
