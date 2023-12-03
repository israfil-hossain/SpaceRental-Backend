import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PaginatedResponseDto } from "../common/dto/paginated-response.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { UserCreateDto } from "./dto/user-create.dto";
import { User, UserDocument, UserModelType } from "./entities/user.entity";
import { UserRole } from "./enum/user-role.enum";

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger("UserService");

  constructor(@InjectModel(User.name) private userModel: UserModelType) {}

  async create(userCreateDto: UserCreateDto): Promise<SuccessResponseDto> {
    try {
      const newUser = new this.userModel(userCreateDto);
      await newUser.save();

      return new SuccessResponseDto("User created successfully", newUser);
    } catch (error) {
      this.logger.error("Error creating user:", error);
      throw new BadRequestException("Error creating user");
    }
  }

  async findAll(
    currentPage: number = 1,
    pageSize: number = 10,
    emailSearch: string = "",
  ): Promise<PaginatedResponseDto> {
    try {
      // Pagination setup
      const totalRecords = await this.userModel.countDocuments().exec();
      const skip = (currentPage - 1) * pageSize;

      // Search query setup
      const searchQuery: Record<string, any> = {};
      if (emailSearch) {
        searchQuery["email"] = { $regex: emailSearch, $options: "i" };
      }

      const users = await this.userModel
        .where(searchQuery)
        .find()
        .skip(skip)
        .limit(pageSize)
        .exec();

      return new PaginatedResponseDto(
        totalRecords,
        currentPage,
        pageSize,
        users,
      );
    } catch (error) {
      this.logger.error("Error finding users:", error);
      throw new BadRequestException("Could not get all users");
    }
  }

  async findOne(id: string): Promise<SuccessResponseDto> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(`Could not find user with ID: ${id}`);
    }

    return new SuccessResponseDto("User found successfully", user);
  }

  async remove(id: string): Promise<SuccessResponseDto> {
    const deletionResult = await this.userModel.findByIdAndDelete(id).exec();
    if (deletionResult) {
      return new SuccessResponseDto("User deleted successfully");
    }

    throw new BadRequestException(`Could not delete user with ID: ${id}`);
  }

  //#region Internal Service methods
  async createUserFromService(
    userCreateDto: UserCreateDto,
  ): Promise<UserDocument> {
    try {
      const newUser = new this.userModel(userCreateDto);
      await newUser.save();

      return newUser;
    } catch (error) {
      this.logger.error("Error creating user:", error);
      throw new BadRequestException(
        "Error occured while trying to create user",
      );
    }
  }

  async getUserByEmailAndRole(
    email: string,
    role: UserRole,
  ): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email, role }).exec();

    if (!user) {
      throw new NotFoundException(`User not found with email: ${email}`);
    }

    return user;
  }

  async getUserById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(`User not found with Id: ${id}`);
    }

    return user;
  }
  //#endregion
}
