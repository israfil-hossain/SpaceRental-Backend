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
import { RequiredRoles } from "../user/decorator/roles.decorator";
import { UserRoleEnum } from "../user/enum/user-role.enum";
import { AddSpaceImageDto } from "./dto/add-space-image.dto";
import { CreateSpaceForRentDto } from "./dto/create-space-for-rent.dto";
import { DeleteSpaceImageDto } from "./dto/delete-space-image.dto";
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
  @RequiredRoles([
    UserRoleEnum.SUPER_ADMIN,
    UserRoleEnum.ADMIN,
    UserRoleEnum.SPACE_OWNER,
  ])
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FilesInterceptor("spaceImages"))
  create(
    @AuthUserId() { userId }: ITokenPayload,
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
  @RequiredRoles([UserRoleEnum.ADMIN, UserRoleEnum.SPACE_OWNER])
  @ApiConsumes("multipart/form-data")
  update(
    @Param() { DocId }: DocIdQueryDto,
    @AuthUserId() { userId }: ITokenPayload,
    @Body() updateSpaceDto: UpdateSpaceForRentDto,
  ) {
    return this._spaceForRentService.update(DocId, updateSpaceDto, userId);
  }

  @Delete("DeleteById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  @RequiredRoles([UserRoleEnum.ADMIN, UserRoleEnum.SPACE_OWNER])
  remove(@Param() { DocId }: DocIdQueryDto) {
    return this._spaceForRentService.remove(DocId);
  }

  @Post("AddSpaceImageById/:DocId")
  @ApiBody({ type: AddSpaceImageDto })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  @RequiredRoles([UserRoleEnum.ADMIN, UserRoleEnum.SPACE_OWNER])
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FilesInterceptor("spaceImages"))
  addImages(
    @Param() { DocId }: DocIdQueryDto,
    @AuthUserId() { userId }: ITokenPayload,
    @UploadedFiles() spaceImages: Array<Express.Multer.File>,
    @Body() addSpaceImageDto: AddSpaceImageDto,
  ) {
    addSpaceImageDto.spaceImages = spaceImages;

    return this._spaceForRentService.addSpaceImage(
      DocId,
      addSpaceImageDto,
      userId,
    );
  }

  @Delete("DeleteSpaceImageById/:SpaceId/:ImageId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  @RequiredRoles([UserRoleEnum.ADMIN, UserRoleEnum.SPACE_OWNER])
  removeSpaceImage(@Param() { SpaceId, ImageId }: DeleteSpaceImageDto) {
    return this._spaceForRentService.removeSpaceImage(ImageId, SpaceId);
  }
}
