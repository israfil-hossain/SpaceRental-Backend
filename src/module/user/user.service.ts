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
import { ImageMeta } from "../image-meta/entities/image-meta.entity";
import { ImageMetaService } from "../image-meta/image-meta.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { ListUserQuery } from "./dto/list-user-query.dto";
import { UpdateProfilePictureDto } from "./dto/update-profile-picture.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UserDocument, UserModel, UserModelType } from "./entities/user.entity";
import { UserRoleDtoEnum, UserRoleEnum } from "./enum/user-role.enum";

@Injectable()
export class UserService {
  private readonly _logger: Logger = new Logger(UserService.name);

  constructor(
    private _encryptionService: EncryptionService,
    @InjectModel(UserModel.name) private _userModel: UserModelType,
    private readonly _imageService: ImageMetaService,
  ) {}

  async create(userCreateDto: CreateUserDto): Promise<SuccessResponseDto> {
    try {
      userCreateDto["password"] = await this._encryptionService.hashPassword(
        userCreateDto.password,
      );
      const newUser = new this._userModel(userCreateDto);
      await newUser.save();

      return new SuccessResponseDto("User created successfully", newUser);
    } catch (error) {
      if (error?.name === "MongoServerError" && error?.code === 11000) {
        this._logger.error("Duplicate key error:", error);
        throw new ConflictException("User already exists");
      }

      this._logger.error("Error creating user:", error);
      throw new BadRequestException("Error creating user");
    }
  }

  async findAll({
    Page = 1,
    PageSize = 10,
    Name = "",
    Email = "",
    UserRole,
  }: ListUserQuery): Promise<PaginatedResponseDto> {
    try {
      // Search query setup
      const searchQuery: Record<string, any> = {};
      if (Email) {
        searchQuery["email"] = { $regex: Email, $options: "i" };
      }
      if (Name) {
        searchQuery["fullName"] = { $regex: Name, $options: "i" };
      }
      if (UserRole) {
        searchQuery["role"] = UserRole;
      }

      // Pagination setup
      const totalRecords = await this._userModel
        .where(searchQuery)
        .countDocuments()
        .exec();
      const skip = (Page - 1) * PageSize;

      const users = await this._userModel
        .where(searchQuery)
        .find()
        .skip(skip)
        .limit(PageSize)
        .exec();

      return new PaginatedResponseDto(totalRecords, Page, PageSize, users);
    } catch (error) {
      this._logger.error("Error finding users:", error);
      throw new BadRequestException("Could not get all users");
    }
  }

  async findOne(id: string): Promise<SuccessResponseDto> {
    const user = await this._userModel.findById(id).exec();

    if (!user) {
      this._logger.error(`User Document not found with ID: ${id}`);
      throw new NotFoundException(`Could not find user with ID: ${id}`);
    }

    return new SuccessResponseDto("User found successfully", user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const result = await this._userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();

      if (!result) {
        this._logger.error(`User Document not found with ID: ${id}`);
        throw new NotFoundException(`Could not find user with ID: ${id}`);
      }

      return new SuccessResponseDto("User updated successfully", result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error.name === "MongoError" && error.code === 11000) {
        this._logger.error("Duplicate key error:", error);
        throw new ConflictException("User already exists");
      }

      this._logger.error("Error updating user:", error);
      throw new BadRequestException("Error updating user");
    }
  }

  async remove(id: string): Promise<SuccessResponseDto> {
    const result = await this._userModel.findByIdAndDelete(id).exec();
    if (!result) {
      this._logger.error(`User Document not delete with ID: ${id}`);
      throw new BadRequestException(`Could not delete user with ID: ${id}`);
    }

    return new SuccessResponseDto("User deleted successfully");
  }

  async updateProfilePicture(
    { profilePicture }: UpdateProfilePictureDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const user = await this._userModel.findById(userId).exec();

      if (!user) {
        this._logger.error(`User Document not found with ID: ${userId}`);
        throw new NotFoundException(`Could not find user with ID: ${userId}`);
      }

      if (user?.profilePicture) {
        await this._imageService.removeImage(
          user?.profilePicture as unknown as string,
          userId,
        );
      }

      const createdImage = await this._imageService.createSingleImage(
        profilePicture,
        userId,
      );

      const result = await user.updateOne(
        {
          profilePicture: createdImage.id,
        },
        {
          new: true,
        },
      );

      if (!result) {
        throw new BadRequestException("Could not update profile picture");
      }

      return new SuccessResponseDto("Profile picture updated successfully");
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      this._logger.error("Error updating user:", error);
      throw new BadRequestException("Error updating user");
    }
  }

  //#region Internal Service methods
  async createUserFromService(
    userCreateDto: CreateUserDto,
  ): Promise<UserDocument> {
    try {
      const newUser = new this._userModel(userCreateDto);
      await newUser.save();

      return newUser;
    } catch (error) {
      if (error?.name === "MongoServerError" && error?.code === 11000) {
        this._logger.error("Duplicate key error:", error);
        throw new ConflictException(
          "User already exists with provided email and role",
        );
      }

      this._logger.error("Error creating user:", error);
      throw new BadRequestException(
        "Error occured while trying to create user",
      );
    }
  }

  async getUserByEmailAndRole(
    email: string,
    role: UserRoleDtoEnum,
  ): Promise<UserDocument> {
    const user = await this._userModel.findOne({ email, role }).exec();

    if (!user) {
      this._logger.error(`User Document not found with Email: ${email}`);
      throw new NotFoundException(`User not found with email: ${email}`);
    }

    return user;
  }

  async getAdminUserByEmail(email: string): Promise<UserDocument> {
    const user = await this._userModel
      .findOne({
        email,
        role: { $in: [UserRoleEnum.ADMIN, UserRoleEnum.SUPER_ADMIN] },
      })
      .exec();

    if (!user) {
      this._logger.error(`Admin User Document not found with Email: ${email}`);
      throw new NotFoundException(`Admin user not found with email: ${email}`);
    }

    return user;
  }

  async getUserById(id: string): Promise<UserDocument> {
    const user = await this._userModel
      .findById(id)
      .populate([
        {
          path: "profilePicture",
          model: ImageMeta.name,
          select: "url",
        },
      ])
      .exec();

    if (!user) {
      this._logger.error(`User Document not found with ID: ${id}`);
      throw new NotFoundException(`User not found with Id: ${id}`);
    }

    return user;
  }
  //#endregion
}
