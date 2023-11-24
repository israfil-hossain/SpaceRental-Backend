import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { PaginatedListDto } from "../common/dto/paginated-list.dto";
import { ResponseDto } from "../common/dto/response.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
  private readonly _modelFilter: string = "-password -isPasswordLess -__v";

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<ResponseDto> {
    try {
      const newUser = new this.userModel(createUserDto);
      await newUser.save();
      return new ResponseDto(
        true,
        `User created successfully with Id: ${newUser?._id}`,
      );
    } catch (error) {
      console.error("Error creating user:", error);
      return new ResponseDto(false, "Error creating user");
    }
  }

  async findAll(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginatedListDto<User>> {
    try {
      const totalRecords = await this.userModel.countDocuments().exec();
      const skip = (page - 1) * pageSize;

      const users = await this.userModel
        .find({}, this._modelFilter)
        .skip(skip)
        .limit(pageSize)
        .exec();

      return new PaginatedListDto<User>(totalRecords, page, pageSize, users);
    } catch (error) {
      console.error("Error finding users:", error);
      throw error;
    }
  }

  async findOne(id: string): Promise<User | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }

    return this.userModel.findById(id, this._modelFilter).exec();
  }

  async remove(id: string): Promise<ResponseDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }

    try {
      const deletionResult = await this.userModel.findByIdAndDelete(id).exec();
      if (deletionResult) {
        return new ResponseDto(true, "User deleted successfully");
      }
      return new ResponseDto(false, "Error deleting user");
    } catch (error) {
      console.error("Error removing user:", error);
      return new ResponseDto(false, "Error deleting user");
    }
  }
}
