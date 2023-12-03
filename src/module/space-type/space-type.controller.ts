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
import { CreateSpaceTypeDto } from "./dto/create-space-type.dto";
import { ListSpaceTypeQuery } from "./dto/list-space-type-query.dto";
import { UpdateSpaceTypeDto } from "./dto/update-space-type.dto";
import { SpaceTypeService } from "./space-type.service";

@ApiTags("Space Type")
@Controller("SpaceType")
export class SpaceTypeController {
  constructor(private readonly spaceTypeService: SpaceTypeService) {}

  @Post("Create")
  @ApiBody({ type: CreateSpaceTypeDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  create(
    @AuthUserId() userId: string,
    @Body() createSpaceTypeDto: CreateSpaceTypeDto,
  ) {
    return this.spaceTypeService.create(createSpaceTypeDto, userId);
  }

  @Get("GetAll")
  @ApiResponse({
    status: 200,
    type: PaginatedResponseDto,
  })
  findAll(@Query() spaceTypeListQuery: ListSpaceTypeQuery) {
    return this.spaceTypeService.findAll(spaceTypeListQuery);
  }

  @Get("GetById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  findOne(@Param() { DocId }: DocIdQueryDto) {
    return this.spaceTypeService.findOne(DocId);
  }

  @Patch("UpdateById/:DocId")
  @ApiBody({ type: UpdateSpaceTypeDto })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  update(
    @Param() { DocId }: DocIdQueryDto,
    @AuthUserId() userId: string,
    @Body() updateSpaceTypeDto: UpdateSpaceTypeDto,
  ) {
    return this.spaceTypeService.update(DocId, updateSpaceTypeDto, userId);
  }

  @Delete("DeleteById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  remove(@Param() { DocId }: DocIdQueryDto) {
    return this.spaceTypeService.remove(DocId);
  }
}
