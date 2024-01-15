import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthUserId } from "../auth/decorator/auth-user-id.decorator";
import { DocIdQueryDto } from "../common/dto/doc-id-query.dto";
import { PaginatedResponseDto } from "../common/dto/paginated-response.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { ApplicationUserService } from "./application-user.service";
import { RequiredRoles } from "./decorator/roles.decorator";
import { CreateApplicationUserDto } from "./dto/create-application-user.dto";
import { ListApplicationUserQuery } from "./dto/list-application-user-query.dto";
import { UpdateApplicationUserProfilePictureDto } from "./dto/update-application-user-profile-picture.dto";
import { ApplicationUserRoleEnum } from "./enum/application-user-role.enum";

@ApiTags("Application Users")
@Controller("ApplicationUser")
export class ApplicationUserController {
  constructor(private readonly _userService: ApplicationUserService) {}

  @Post("Create")
  @ApiBody({ type: CreateApplicationUserDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  @RequiredRoles([ApplicationUserRoleEnum.SUPER_ADMIN])
  create(@Body() createUserDto: CreateApplicationUserDto) {
    return this._userService.create(createUserDto);
  }

  @Get("GetAll")
  @ApiResponse({
    status: 200,
    type: PaginatedResponseDto,
  })
  @RequiredRoles([
    ApplicationUserRoleEnum.SUPER_ADMIN,
    ApplicationUserRoleEnum.ADMIN,
  ])
  findAll(@Query() query: ListApplicationUserQuery) {
    return this._userService.findAll(query);
  }

  @Get("GetById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  @RequiredRoles([
    ApplicationUserRoleEnum.SUPER_ADMIN,
    ApplicationUserRoleEnum.ADMIN,
  ])
  findOne(@Param() { DocId }: DocIdQueryDto) {
    return this._userService.findOne(DocId);
  }

  @Delete("DeleteById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  @RequiredRoles([
    ApplicationUserRoleEnum.SUPER_ADMIN,
    ApplicationUserRoleEnum.ADMIN,
  ])
  remove(@Param() { DocId }: DocIdQueryDto) {
    return this._userService.remove(DocId);
  }

  @Patch("UpdateOwnProfilePicture")
  @ApiBody({ type: UpdateApplicationUserProfilePictureDto })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("profilePicture"))
  updateProfilePicture(
    @AuthUserId() { userId }: ITokenPayload,
    @UploadedFile() profilePicture: Express.Multer.File,
    @Body() updateProfilePictureDto: UpdateApplicationUserProfilePictureDto,
  ) {
    updateProfilePictureDto.profilePicture = profilePicture;

    return this._userService.updateProfilePicture(
      updateProfilePictureDto,
      userId,
    );
  }
}
