import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserIdQueryDto } from "./dto/user-id-query.dto";
import { UserListQuery } from "./dto/user-list-query.dto";
import { UserService } from "./user.service";

@ApiTags("Users")
@Controller("User")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("Create")
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get("GetAll")
  findAll(@Query() query: UserListQuery) {
    return this.userService.findAll(
      query.Page,
      query.PageSize,
      query.EmailSearch,
    );
  }

  @Get("GetById/:UserId")
  findOne(@Param() { UserId }: UserIdQueryDto) {
    return this.userService.findOne(UserId);
  }

  @Delete("DeleteById/:UserId")
  remove(@Param() { UserId }: UserIdQueryDto) {
    return this.userService.remove(UserId);
  }
}
