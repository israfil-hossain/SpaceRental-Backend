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
import { RequiredRoles } from "../application-user/decorator/roles.decorator";
import { ApplicationUserRoleEnum } from "../application-user/enum/application-user-role.enum";
import { AuthUserId } from "../authentication/decorator/auth-user-id.decorator";
import { DocIdQueryDto } from "../common/dto/doc-id-query.dto";
import { PaginatedResponseDto } from "../common/dto/paginated-response.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { AddSpaceImageDto } from "./dto/add-space-image.dto";
import { CreateSpaceForRentDto } from "./dto/create-space-for-rent.dto";
import { DeleteSpaceImageDto } from "./dto/delete-space-image.dto";
import { ListSpaceForRentQuery } from "./dto/list-space-for-rent-query.dto";
import { UpdateSpaceForRentDto } from "./dto/update-space-for-rent.dto";
import { SpaceForRentService } from "./space-for-rent.service";

@ApiTags("Space - For Rent")
@Controller("SpaceForRent")
export class SpaceForRentController {
  constructor(private readonly spaceForRentService: SpaceForRentService) {}

  @Post("Create")
  @ApiBody({ type: CreateSpaceForRentDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  @RequiredRoles([
    ApplicationUserRoleEnum.ADMIN,
    ,
    ApplicationUserRoleEnum.OWNER,
  ])
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FilesInterceptor("spaceImages"))
  create(
    @AuthUserId() { userId }: ITokenPayload,
    @UploadedFiles() spaceImages: Array<Express.Multer.File>,
    @Body() createSpaceDto: CreateSpaceForRentDto,
  ) {
    createSpaceDto.spaceImages = spaceImages;

    return this.spaceForRentService.create(createSpaceDto, userId);
  }

  @Get("GetAll")
  @ApiResponse({
    status: 200,
    type: PaginatedResponseDto,
  })
  findAll(
    @AuthUserId() { userId, userRole }: ITokenPayload,
    @Query() listSpaceForRentQuery: ListSpaceForRentQuery,
  ) {
    return this.spaceForRentService.findAll(
      listSpaceForRentQuery,
      userId,
      userRole,
    );
  }

  @Get("GetById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  findOne(@Param() { DocId }: DocIdQueryDto) {
    return this.spaceForRentService.findOne(DocId);
  }

  @Patch("UpdateById/:DocId")
  @ApiBody({ type: UpdateSpaceForRentDto })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  @RequiredRoles([
    ApplicationUserRoleEnum.ADMIN,
    ,
    ApplicationUserRoleEnum.OWNER,
  ])
  @ApiConsumes("multipart/form-data")
  update(
    @Param() { DocId }: DocIdQueryDto,
    @AuthUserId() { userId }: ITokenPayload,
    @Body() updateSpaceDto: UpdateSpaceForRentDto,
  ) {
    return this.spaceForRentService.update(DocId, updateSpaceDto, userId);
  }

  @Delete("DeleteById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  @RequiredRoles([
    ApplicationUserRoleEnum.ADMIN,
    ,
    ApplicationUserRoleEnum.OWNER,
  ])
  remove(@Param() { DocId }: DocIdQueryDto) {
    return this.spaceForRentService.remove(DocId);
  }

  @Post("AddSpaceImageById/:DocId")
  @ApiBody({ type: AddSpaceImageDto })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  @RequiredRoles([
    ApplicationUserRoleEnum.ADMIN,
    ,
    ApplicationUserRoleEnum.OWNER,
  ])
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FilesInterceptor("spaceImages"))
  addImages(
    @Param() { DocId }: DocIdQueryDto,
    @AuthUserId() { userId }: ITokenPayload,
    @UploadedFiles() spaceImages: Array<Express.Multer.File>,
    @Body() addSpaceImageDto: AddSpaceImageDto,
  ) {
    addSpaceImageDto.spaceImages = spaceImages;

    return this.spaceForRentService.addSpaceImage(
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
  @RequiredRoles([
    ApplicationUserRoleEnum.ADMIN,
    ,
    ApplicationUserRoleEnum.OWNER,
  ])
  removeSpaceImage(@Param() { SpaceId, ImageId }: DeleteSpaceImageDto) {
    return this.spaceForRentService.removeSpaceImage(ImageId, SpaceId);
  }
}
