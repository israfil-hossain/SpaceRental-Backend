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
import { CreateSpaceAccessOptionDto } from "./dto/create-space-access-option.dto";
import { ListSpaceAccessOptionQuery } from "./dto/list-space-access-option-query.dto";
import { UpdateSpaceAccessOptionDto } from "./dto/update-space-access-option.dto";
import { SpaceAccessOptionService } from "./space-access-option.service";

@ApiTags("Space Access Option")
@Controller("SpaceAccessOption")
export class SpaceAccessOptionController {
  constructor(
    private readonly spaceAccessOptionService: SpaceAccessOptionService,
  ) {}

  @Post("Create")
  create(
    @AuthUserId() userId: string,
    @Body() createSpaceAccessOptionDto: CreateSpaceAccessOptionDto,
  ) {
    return this.spaceAccessOptionService.create(
      createSpaceAccessOptionDto,
      userId,
    );
  }

  @Get("GetAll")
  findAll(@Query() spaceTypeListQuery: ListSpaceAccessOptionQuery) {
    return this.spaceAccessOptionService.findAll(spaceTypeListQuery);
  }

  @Get("GetById/:DocId")
  findOne(@Param() { DocId }: DocIdQueryDto) {
    return this.spaceAccessOptionService.findOne(DocId);
  }

  @Patch("UpdateById/:DocId")
  update(
    @Param() { DocId }: DocIdQueryDto,
    @AuthUserId() userId: string,
    @Body() updateSpaceAccessOptionDto: UpdateSpaceAccessOptionDto,
  ) {
    return this.spaceAccessOptionService.update(
      DocId,
      updateSpaceAccessOptionDto,
      userId,
    );
  }

  @Delete("DeleteById/:DocId")
  remove(@Param() { DocId }: DocIdQueryDto) {
    return this.spaceAccessOptionService.remove(DocId);
  }
}
