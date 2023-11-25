import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { CreateUserDto } from "../../domain/dtos/user/create-user.dto";
import { UserService } from "../../service/user/user.service";

@ApiTags("Users")
@Controller("User")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("Create")
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get("GetAll")
  findAll() {
    return this.userService.findAll();
  }

  @Get("GetById/:id")
  findOne(@Param("id") id: string) {
    return this.userService.findOne(id);
  }

  @Delete("DeleteById/:id")
  remove(@Param("id") id: string) {
    return this.userService.remove(id);
  }
}
