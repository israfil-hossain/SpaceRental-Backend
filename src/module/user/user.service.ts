import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find({}, "-email").exec();
  }

  async findOne(id: string): Promise<User | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }

    return this.userModel.findById(id).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }

    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, {
          new: true,
        })
        .exec();

      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      return null;
    }
  }

  async remove(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID");
    }

    try {
      const deletionResult = await this.userModel.findByIdAndDelete(id).exec();

      return deletionResult ? true : false;
    } catch (error) {
      console.error("Error removing user:", error);
      return false;
    }
  }
}
