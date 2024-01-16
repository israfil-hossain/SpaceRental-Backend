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
import { CreateSpaceAccessTypeDto } from "./dto/create-space-access-type.dto";
import { ListSpaceAccessTypeQuery } from "./dto/list-space-access-type-query.dto";
import { UpdateSpaceAccessTypeDto } from "./dto/update-space-access-type.dto";
import {
  SpaceAccessType,
  SpaceAccessTypeType,
} from "./entities/space-access-type.entity";

@Injectable()
export class SpaceAccessTypeService {
  private readonly _logger: Logger = new Logger(SpaceAccessTypeService.name);

  constructor(
    @InjectModel(SpaceAccessType.name)
    private _spaceAccessType: SpaceAccessTypeType,
  ) {}

  async create(
    createSpaceAccessTypeDto: CreateSpaceAccessTypeDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const result = new this._spaceAccessType({
        ...createSpaceAccessTypeDto,
        createdBy: userId,
      });
      await result.save();

      return new SuccessResponseDto("Document created successfully", result);
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
  }: ListSpaceAccessTypeQuery): Promise<PaginatedResponseDto> {
    try {
      // Search query setup
      const searchQuery: Record<string, any> = {};
      if (Name) {
        searchQuery["name"] = { $regex: Name, $options: "i" };
      }

      // Pagination setup
      const totalRecords = await this._spaceAccessType
        .where(searchQuery)
        .countDocuments()
        .exec();
      const skip = (Page - 1) * PageSize;

      const result = await this._spaceAccessType
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
    const result = await this._spaceAccessType
      .findById(id)
      .populate([
        {
          path: "createdBy",
          select: "id email fullName",
        },
        {
          path: "updatedBy",
          select: "id email fullName",
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
    updateSpaceAccessTypeDto: UpdateSpaceAccessTypeDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const result = await this._spaceAccessType
        .findByIdAndUpdate(
          id,
          {
            ...updateSpaceAccessTypeDto,
            updatedBy: userId,
            updatedAt: new Date(),
          },
          { new: true },
        )
        .exec();

      if (!result) {
        this._logger.error(`Document not found with ID: ${id}`);
        throw new NotFoundException(`Could not find document with ID: ${id}`);
      }

      return new SuccessResponseDto("Document updated successfully", result);
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
    const result = await this._spaceAccessType.findByIdAndDelete(id).exec();

    if (!result) {
      this._logger.error(`Document not found with ID: ${id}`);
      throw new BadRequestException(`Could not delete document with ID: ${id}`);
    }

    return new SuccessResponseDto("Document deleted successfully");
  }

  //#region InternalMethods
  //#endregion
}
