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
import { DocIdQueryDto } from "../common/dto/doc-id-query.dto";
import { UserCreateDto } from "./dto/user-create.dto";
import { UserListQuery } from "./dto/user-list-query.dto";
import { UserService } from "./user.service";

@ApiTags("Users")
@Controller("User")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("Create")
  create(@Body() createUserDto: UserCreateDto) {
    return this.userService.create(createUserDto);
  }

  @Get("GetAll")
  findAll(@Query() query: UserListQuery) {
    return this.userService.findAll(query);
  }

  @Get("GetById/:DocId")
  findOne(@Param() { DocId }: DocIdQueryDto) {
    return this.userService.findOne(DocId);
  }

  @Delete("DeleteById/:DocId")
  remove(@Param() { DocId }: DocIdQueryDto) {
    return this.userService.remove(DocId);
  }
}
