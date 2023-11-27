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
import { IsPublic } from "../auth/guard/auth.guard";
import { PaginationQuery } from "../common/dto/pagintation-query.dto";
import { IdParamValidator } from "../common/pipes/id-param-validator.pipe";
import { CreateUserDto } from "./dto/create-user.dto";
import { UserService } from "./user.service";

@ApiTags("Users")
@Controller("User")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("Create")
  @IsPublic()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get("GetAll")
  findAll(@Query() pagination: PaginationQuery) {
    const paginationQuery = PaginationQuery.from(pagination);

    return this.userService.findAll(
      paginationQuery.Page,
      paginationQuery.PageSize,
    );
  }

  @Get("GetById/:UserId")
  findOne(@Param("UserId", IdParamValidator) userId: string) {
    return this.userService.findOne(userId);
  }

  @Delete("DeleteById/:UserId")
  remove(@Param("UserId", IdParamValidator) userId: string) {
    return this.userService.remove(userId);
  }
}
