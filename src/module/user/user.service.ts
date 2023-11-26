import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { PaginatedResponseDto } from "../common/dto/paginated-response.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateUserDto } from "./dto/create-user.dto";
import { User, UserDocument } from "./entities/user.entity";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<SuccessResponseDto> {
    try {
      const newUser = new this.userModel(createUserDto);
      await newUser.save();
      return new SuccessResponseDto("User created successfully", newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      throw new BadRequestException("Error creating user");
    }
  }

  async findAll(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginatedResponseDto> {
    try {
      const totalRecords = await this.userModel.countDocuments().exec();
      const skip = (page - 1) * pageSize;

      const users = await this.userModel
        .find()
        .skip(skip)
        .limit(pageSize)
        .exec();

      return new PaginatedResponseDto(totalRecords, page, pageSize, users);
    } catch (error) {
      console.error("Error finding users:", error);
      throw new BadRequestException("Could not get all users");
    }
  }

  async findOne(id: string): Promise<SuccessResponseDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid user ID");
    }

    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(`Could not find user with ID: ${id}`);
    }

    return new SuccessResponseDto("User found successfully", user);
  }

  async getUserByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.where({ email }).findOne().exec();

    if (!user) {
      throw new NotFoundException(`Could not find user with email: ${email}`);
    }

    return user;
  }

  async remove(id: string): Promise<SuccessResponseDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid user ID");
    }

    const deletionResult = await this.userModel.findByIdAndDelete(id).exec();
    if (deletionResult) {
      return new SuccessResponseDto("User deleted successfully");
    }

    throw new BadRequestException(`Could not delete user with ID: ${id}`);
  }
}
