import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";

@ApiTags("Users")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("create")
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get("get-all")
  findAll() {
    return this.userService.findAll();
  }

  @Get("get-by-id:id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(id);
  }

  @Patch("update-by-id:id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete("delete-by-id:id")
  remove(@Param("id") id: string) {
    return this.userService.remove(id);
  }
}
