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
import { CreateSpaceDto } from "./dto/create-space.dto";
import { ListSpaceQuery } from "./dto/list-space-query.dto";
import { UpdateSpaceDto } from "./dto/update-space.dto";
import { SpaceService } from "./space.service";

@ApiTags("Space for Rent")
@Controller("Space")
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Post("Create")
  @ApiBody({ type: CreateSpaceDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  create(@AuthUserId() userId: string, @Body() createSpaceDto: CreateSpaceDto) {
    return this.spaceService.create(createSpaceDto, userId);
  }

  @Get("GetAll")
  @ApiResponse({
    status: 200,
    type: PaginatedResponseDto,
  })
  findAll(@Query() listSpaceQuery: ListSpaceQuery) {
    return this.spaceService.findAll(listSpaceQuery);
  }

  @Get("GetById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  findOne(@Param() { DocId }: DocIdQueryDto) {
    return this.spaceService.findOne(DocId);
  }

  @Patch("UpdateById/:DocId")
  @ApiBody({ type: UpdateSpaceDto })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  update(
    @Param() { DocId }: DocIdQueryDto,
    @AuthUserId() userId: string,
    @Body() updateSpaceDto: UpdateSpaceDto,
  ) {
    return this.spaceService.update(DocId, updateSpaceDto, userId);
  }

  @Delete("DeleteById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  remove(@Param() { DocId }: DocIdQueryDto) {
    return this.spaceService.remove(DocId);
  }
}
