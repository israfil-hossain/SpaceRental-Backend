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

  @Patch("UpdateById/:id")
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete("DeleteById/:id")
  remove(@Param("id") id: string) {
    return this.userService.remove(id);
  }
}
