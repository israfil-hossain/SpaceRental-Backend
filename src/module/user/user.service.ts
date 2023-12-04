import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PaginatedResponseDto } from "../common/dto/paginated-response.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { EncryptionService } from "../encryption/encryption.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { ListUserQuery } from "./dto/list-user-query.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User, UserDocument, UserModelType } from "./entities/user.entity";
import { UserRole } from "./enum/user-role.enum";

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger("UserService");

  constructor(
    private encryptionService: EncryptionService,
    @InjectModel(User.name) private userModel: UserModelType,
  ) {}

  async create(userCreateDto: CreateUserDto): Promise<SuccessResponseDto> {
    try {
      userCreateDto["password"] = await this.encryptionService.hashPassword(
        userCreateDto.password,
      );
      const newUser = new this.userModel(userCreateDto);
      await newUser.save();

      return new SuccessResponseDto("User created successfully", newUser);
    } catch (error) {
      if (error?.name === "MongoServerError" && error?.code === 11000) {
        this.logger.error("Duplicate key error:", error);
        throw new ConflictException("Useralready exists");
      }

      this.logger.error("Error creating user:", error);
      throw new BadRequestException("Error creating user");
    }
  }

  async findAll({
    Page = 1,
    PageSize = 10,
    Name = "",
    Email = "",
  }: ListUserQuery): Promise<PaginatedResponseDto> {
    try {
      // Pagination setup
      const totalRecords = await this.userModel.countDocuments().exec();
      const skip = (Page - 1) * PageSize;

      // Search query setup
      const searchQuery: Record<string, any> = {};
      if (Email) {
        searchQuery["email"] = { $regex: Email, $options: "i" };
      }
      if (Name) {
        searchQuery["fullName"] = { $regex: Name, $options: "i" };
      }

      const users = await this.userModel
        .where(searchQuery)
        .find()
        .skip(skip)
        .limit(PageSize)
        .exec();

      return new PaginatedResponseDto(totalRecords, Page, PageSize, users);
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

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const result = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();

      if (!result) {
        throw new NotFoundException(`Could not find user with ID: ${id}`);
      }

      return new SuccessResponseDto("User updated successfully", result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error.name === "MongoError" && error.code === 11000) {
        this.logger.error("Duplicate key error:", error);
        throw new ConflictException("User already exists");
      }

      this.logger.error("Error updating user:", error);
      throw new BadRequestException("Error updating user");
    }
  }

  async remove(id: string): Promise<SuccessResponseDto> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new BadRequestException(`Could not delete user with ID: ${id}`);
    }

    return new SuccessResponseDto("User deleted successfully");
  }

  //#region Internal Service methods
  async createUserFromService(
    userCreateDto: CreateUserDto,
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
