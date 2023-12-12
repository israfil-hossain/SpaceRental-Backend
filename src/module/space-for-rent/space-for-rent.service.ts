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
import { ImageModel } from "../image/entities/image.entity";
import { ImageService } from "../image/image.service";
import { SpaceAccessOptionModel } from "../space-access-option/entities/space-access-option.entity";
import { SpaceScheduleFeatureModel } from "../space-features/entities/space-schedule-feature";
import { SpaceSecurityFeatureModel } from "../space-features/entities/space-security-feature";
import { StorageConditionFeatureModel } from "../space-features/entities/storage-condition-feature";
import { UnloadingMovingFeatureModel } from "../space-features/entities/unloading-moving-feature";
import { SpaceTypeModel } from "../space-type/entities/space-type.entity";
import { UserModel } from "../user/entities/user.entity";
import { CreateSpaceForRentDto } from "./dto/create-space-for-rent.dto";
import { ListSpaceForRentQuery } from "./dto/list-space-for-rent-query.dto";
import { UpdateSpaceForRentDto } from "./dto/update-space-for-rent.dto";
import {
  SpaceForRentModel,
  SpaceForRentModelType,
} from "./entities/space-for-rent.entity";

@Injectable()
export class SpaceForRentService {
  private readonly _logger: Logger = new Logger(SpaceForRentService.name);

  constructor(
    @InjectModel(SpaceForRentModel.name)
    private _spaceForRentModel: SpaceForRentModelType,
    private readonly _imageService: ImageService,
  ) {}

  async create(
    createSpaceDto: CreateSpaceForRentDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      // Create new space document
      const createdImages = await this._imageService.createMultipleImages(
        createSpaceDto.spaceImages,
        userId,
      );
      const spaceImagesIDs = createdImages.map((image) => image.id);

      const newItem = new this._spaceForRentModel({
        ...createSpaceDto,
        spaceImages: spaceImagesIDs,
        createdBy: userId,
      });

      await newItem.save();
      return new SuccessResponseDto("New Space created successfully", newItem);
    } catch (error) {
      if (error?.name === "MongoServerError" && error?.code === 11000) {
        this._logger.error("Duplicate key error:", error);
        throw new ConflictException("Document already exists");
      }

      this._logger.error("Error creating new document:", error);
      throw new BadRequestException("Error creating new document");
    }
  }

  async findAll({
    Page = 1,
    PageSize = 10,
    Name = "",
  }: ListSpaceForRentQuery): Promise<PaginatedResponseDto> {
    try {
      // Pagination setup
      const totalRecords = await this._spaceForRentModel
        .countDocuments()
        .exec();
      const skip = (Page - 1) * PageSize;

      // Search query setup
      const searchQuery: Record<string, any> = {};
      if (Name) {
        searchQuery["name"] = { $regex: Name, $options: "i" };
      }

      const result = await this._spaceForRentModel
        .where(searchQuery)
        .find()
        .skip(skip)
        .limit(PageSize)
        .exec();

      return new PaginatedResponseDto(totalRecords, Page, PageSize, result);
    } catch (error) {
      this._logger.error("Error finding all document:", error);
      throw new BadRequestException("Could not get all document");
    }
  }

  async findOne(id: string): Promise<SuccessResponseDto> {
    const result = await this._spaceForRentModel
      .findById(id)
      .populate([
        {
          path: "createdBy",
          model: UserModel.name,
          select: "id email fullName",
        },
        {
          path: "updatedBy",
          model: UserModel.name,
          select: "id email fullName",
        },
        {
          path: "type",
          model: SpaceTypeModel.name,
          select: "id name",
        },
        {
          path: "accessMethod",
          model: SpaceAccessOptionModel.name,
          select: "id name",
        },
        {
          path: "storageConditions",
          model: StorageConditionFeatureModel.name,
          select: "id name",
        },
        {
          path: "unloadingMovings",
          model: UnloadingMovingFeatureModel.name,
          select: "id name",
        },
        {
          path: "spaceSecurities",
          model: SpaceSecurityFeatureModel.name,
          select: "id name",
        },
        {
          path: "spaceSchedules",
          model: SpaceScheduleFeatureModel.name,
          select: "id name",
        },
        {
          path: "spaceImages",
          model: ImageModel.name,
          select: "id url name extension size mimeType",
        },
      ])
      .exec();

    if (!result) {
      this._logger.error(`Document not found with ID: ${id}`);
      throw new NotFoundException(`Could not find document with ID: ${id}`);
    }

    return new SuccessResponseDto("Document found successfully", result);
  }

  async update(
    id: string,
    updateSpaceDto: UpdateSpaceForRentDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const updatedItem = await this._spaceForRentModel
        .findByIdAndUpdate(
          id,
          {
            ...updateSpaceDto,
            updatedBy: userId,
            updatedAt: new Date(),
          },
          { new: true },
        )
        .exec();

      if (!updatedItem) {
        this._logger.error(`Document not found with ID: ${id}`);
        throw new NotFoundException(`Could not find space type with ID: ${id}`);
      }

      return new SuccessResponseDto(
        "Document updated successfully",
        updatedItem,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error.name === "MongoError" && error.code === 11000) {
        this._logger.error("Duplicate key error:", error);
        throw new ConflictException("Document already exists");
      }

      this._logger.error("Error updating document:", error);
      throw new BadRequestException("Error updating document");
    }
  }

  async remove(id: string): Promise<SuccessResponseDto> {
    const result = await this._spaceForRentModel.findByIdAndDelete(id).exec();

    if (!result) {
      this._logger.error(`Document not deleted with ID: ${id}`);
      throw new BadRequestException(`Could not delete document with ID: ${id}`);
    }

    return new SuccessResponseDto("Document deleted successfully");
  }

  async removeSpaceImage(id: string): Promise<SuccessResponseDto> {
    const result = await this._imageService.removeImage(id);

    if (!result) {
      this._logger.error(`Image not deleted with ID: ${id}`);
      throw new BadRequestException(`Could not delete image with ID: ${id}`);
    }

    return new SuccessResponseDto("Image deleted successfully");
  }
}
