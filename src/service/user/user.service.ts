import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { OperationResponseDto } from "../../domain/dtos/common/operation-response.dto";
import { PaginatedResponseDto } from "../../domain/dtos/common/paginated-response.dto";
import { CreateUserDto } from "../../domain/dtos/user/create-user.dto";
import { User } from "../../domain/entities/user/user.entity";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<OperationResponseDto> {
    try {
      const newUser = new this.userModel(createUserDto);
      await newUser.save();
      return OperationResponseDto.Success("User created successfully", newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      return OperationResponseDto.Failure("Error creating user");
    }
  }

  async findAll(
    page: number = 1,
    pageSize: number = 10,
  ): Promise<PaginatedResponseDto<User>> {
    try {
      const totalRecords = await this.userModel.countDocuments().exec();
      const skip = (page - 1) * pageSize;

      const users = await this.userModel
        .find()
        .skip(skip)
        .limit(pageSize)
        .exec();

      return new PaginatedResponseDto<User>(
        totalRecords,
        page,
        pageSize,
        users,
      );
    } catch (error) {
      console.error("Error finding users:", error);
      throw error;
    }
  }

  async findOne(id: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid user ID");
    }

    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(`Could not find user with ID: ${id}`);
    }

    return user;
  }

  async remove(id: string): Promise<OperationResponseDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException("Invalid user ID");
    }

    const deletionResult = await this.userModel.findByIdAndDelete(id).exec();
    if (deletionResult) {
      return OperationResponseDto.Success("User deleted successfully");
    }

    throw new BadRequestException(`Could not delete user with ID: ${id}`);
  }
}
