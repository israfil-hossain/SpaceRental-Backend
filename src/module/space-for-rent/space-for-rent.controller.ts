import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthUserId } from "../auth/decorator/auth-user-id.decorator";
import { DocIdQueryDto } from "../common/dto/doc-id-query.dto";
import { PaginatedResponseDto } from "../common/dto/paginated-response.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { AddSpaceImageDto } from "./dto/add-space-image.dto";
import { CreateSpaceForRentDto } from "./dto/create-space-for-rent.dto";
import { ListSpaceForRentQuery } from "./dto/list-space-for-rent-query.dto";
import { UpdateSpaceForRentDto } from "./dto/update-space-for-rent.dto";
import { SpaceForRentService } from "./space-for-rent.service";

@ApiTags("Space for Rent")
@Controller("SpaceForRent")
export class SpaceForRentController {
  constructor(private readonly _spaceForRentService: SpaceForRentService) {}

  @Post("Create")
  @ApiBody({ type: CreateSpaceForRentDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FilesInterceptor("spaceImages"))
  create(
    @AuthUserId() userId: string,
    @UploadedFiles() spaceImages: Array<Express.Multer.File>,
    @Body() createSpaceDto: CreateSpaceForRentDto,
  ) {
    createSpaceDto.spaceImages = spaceImages;

    return this._spaceForRentService.create(createSpaceDto, userId);
  }

  @Get("GetAll")
  @ApiResponse({
    status: 200,
    type: PaginatedResponseDto,
  })
  findAll(@Query() listSpaceForRentQuery: ListSpaceForRentQuery) {
    return this._spaceForRentService.findAll(listSpaceForRentQuery);
  }

  @Get("GetById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  findOne(@Param() { DocId }: DocIdQueryDto) {
    return this._spaceForRentService.findOne(DocId);
  }

  @Patch("UpdateById/:DocId")
  @ApiBody({ type: UpdateSpaceForRentDto })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  @ApiConsumes("multipart/form-data")
  update(
    @Param() { DocId }: DocIdQueryDto,
    @AuthUserId() userId: string,
    @Body() updateSpaceDto: UpdateSpaceForRentDto,
  ) {
    return this._spaceForRentService.update(DocId, updateSpaceDto, userId);
  }

  @Delete("DeleteById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  remove(@Param() { DocId }: DocIdQueryDto) {
    return this._spaceForRentService.remove(DocId);
  }

  @Post("AddSpaceImageById/:DocId")
  @ApiBody({ type: AddSpaceImageDto })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  @ApiConsumes("multipart/form-data")
  addImages(
    @Param() { DocId }: DocIdQueryDto,
    @AuthUserId() userId: string,
    @Body() addSpaceImageDto: AddSpaceImageDto,
  ) {
    return this._spaceForRentService.addSpaceImage(
      DocId,
      addSpaceImageDto,
      userId,
    );
  }

  @Delete("DeleteSpaceImageById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  removeSpaceImage(@Param() { DocId }: DocIdQueryDto) {
    return this._spaceForRentService.removeSpaceImage(DocId);
  }
}
