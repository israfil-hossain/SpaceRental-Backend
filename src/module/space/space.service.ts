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
import { SpaceAccessOptionModel } from "../space-access-option/entities/space-access-option.entity";
import { SpaceScheduleFeatureModel } from "../space-features/entities/space-schedule-feature";
import { SpaceSecurityFeatureModel } from "../space-features/entities/space-security-feature";
import { StorageConditionFeatureModel } from "../space-features/entities/storage-condition-feature";
import { UnloadingMovingFeatureModel } from "../space-features/entities/unloading-moving-feature";
import { SpaceTypeModel } from "../space-type/entities/space-type.entity";
import { UserModel } from "../user/entities/user.entity";
import { CreateSpaceDto } from "./dto/create-space.dto";
import { ListSpaceQuery } from "./dto/list-space-query.dto";
import { UpdateSpaceDto } from "./dto/update-space.dto";
import { SpaceModel, SpaceModelType } from "./entities/space.entity";

@Injectable()
export class SpaceService {
  private readonly _logger: Logger = new Logger(SpaceService.name);

  constructor(
    @InjectModel(SpaceModel.name) private _spaceModel: SpaceModelType,
  ) {}

  async create(
    createSpaceDto: CreateSpaceDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      this._logger.log(JSON.stringify(createSpaceDto));

      const newItem = new this._spaceModel({
        ...createSpaceDto,
        createdBy: userId,
      });
      // await newItem.save();

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
  }: ListSpaceQuery): Promise<PaginatedResponseDto> {
    try {
      // Pagination setup
      const totalRecords = await this._spaceModel.countDocuments().exec();
      const skip = (Page - 1) * PageSize;

      // Search query setup
      const searchQuery: Record<string, any> = {};
      if (Name) {
        searchQuery["name"] = { $regex: Name, $options: "i" };
      }

      const result = await this._spaceModel
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
    const result = await this._spaceModel
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
    updateSpaceDto: UpdateSpaceDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const updatedItem = await this._spaceModel
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
    const result = await this._spaceModel.findByIdAndDelete(id).exec();

    if (!result) {
      this._logger.error(`Document not deleted with ID: ${id}`);
      throw new BadRequestException(`Could not delete document with ID: ${id}`);
    }

    return new SuccessResponseDto("Document deleted successfully");
  }
}
