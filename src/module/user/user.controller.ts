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
import { RequiredRoles } from "./decorator/roles.decorator";
import { CreateUserDto } from "./dto/create-user.dto";
import { ListUserQuery } from "./dto/list-user-query.dto";
import { UpdateProfilePictureDto } from "./dto/update-profile-picture.dto";
import { UserRoleEnum } from "./enum/user-role.enum";
import { UserService } from "./user.service";

@ApiTags("Users")
@Controller("User")
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Post("Create")
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  @RequiredRoles([UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN])
  create(@Body() createUserDto: CreateUserDto) {
    return this._userService.create(createUserDto);
  }

  @Get("GetAll")
  @ApiResponse({
    status: 200,
    type: PaginatedResponseDto,
  })
  @RequiredRoles([UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN])
  findAll(@Query() query: ListUserQuery) {
    return this._userService.findAll(query);
  }

  @Get("GetById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  @RequiredRoles([UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN])
  findOne(@Param() { DocId }: DocIdQueryDto) {
    return this._userService.findOne(DocId);
  }

  @Delete("DeleteById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  @RequiredRoles([UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN])
  remove(@Param() { DocId }: DocIdQueryDto) {
    return this._userService.remove(DocId);
  }

  @Patch("UpdateOwnProfilePicture")
  @ApiBody({ type: UpdateProfilePictureDto })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(FileInterceptor("profilePicture"))
  updateProfilePicture(
    @AuthUserId() { userId }: ITokenPayload,
    @UploadedFile() profilePicture: Express.Multer.File,
    @Body() updateProfilePictureDto: UpdateProfilePictureDto,
  ) {
    updateProfilePictureDto.profilePicture = profilePicture;

    return this._userService.updateProfilePicture(
      updateProfilePictureDto,
      userId,
    );
  }
}
