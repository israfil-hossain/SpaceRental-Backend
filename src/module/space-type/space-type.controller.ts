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
import { ApiTags } from "@nestjs/swagger";
import { AuthUserId } from "../auth/decorator/auth-user-id.decorator";
import { DocIdQueryDto } from "../common/dto/doc-id-query.dto";
import { CreateSpaceTypeDto } from "./dto/create-space-type.dto";
import { ListSpaceTypeQuery } from "./dto/list-space-type-query.dto";
import { UpdateSpaceTypeDto } from "./dto/update-space-type.dto";
import { SpaceTypeService } from "./space-type.service";

@ApiTags("Space Type")
@Controller("space-type")
export class SpaceTypeController {
  constructor(private readonly spaceTypeService: SpaceTypeService) {}

  @Post("Create")
  create(
    @AuthUserId() userId: string,
    @Body() createSpaceTypeDto: CreateSpaceTypeDto,
  ) {
    return this.spaceTypeService.create(createSpaceTypeDto, userId);
  }

  @Get("GetAll")
  findAll(@Query() spaceTypeListQuery: ListSpaceTypeQuery) {
    return this.spaceTypeService.findAll(spaceTypeListQuery);
  }

  @Get("GetById/:DocId")
  findOne(@Param() { DocId }: DocIdQueryDto) {
    return this.spaceTypeService.findOne(DocId);
  }

  @Patch("UpdateById/:DocId")
  update(
    @Param() { DocId }: DocIdQueryDto,
    @AuthUserId() userId: string,
    @Body() updateSpaceTypeDto: UpdateSpaceTypeDto,
  ) {
    return this.spaceTypeService.update(DocId, updateSpaceTypeDto, userId);
  }

  @Delete("DeleteById/:DocId")
  remove(@Param() { DocId }: DocIdQueryDto) {
    return this.spaceTypeService.remove(DocId);
  }
}
