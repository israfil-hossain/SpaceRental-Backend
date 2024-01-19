import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { PaginatedResponseDto } from "../common/dto/paginated-response.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateSpaceTypeDto } from "./dto/create-space-type.dto";
import { ListSpaceTypeQuery } from "./dto/list-space-type-query.dto";
import { UpdateSpaceTypeDto } from "./dto/update-space-type.dto";
import { SpaceTypeRepository } from "./space-type.repository";

@Injectable()
export class SpaceTypeService {
  private readonly _logger: Logger = new Logger(SpaceTypeService.name);

  constructor(private readonly _spaceTypeRepository: SpaceTypeRepository) {}

  async create(
    createSpaceTypeDto: CreateSpaceTypeDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const newSpaceType = await this._spaceTypeRepository.create({
        ...createSpaceTypeDto,
        createdBy: userId,
      });

      return new SuccessResponseDto(
        "Document created successfully",
        newSpaceType,
      );
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
  }: ListSpaceTypeQuery): Promise<PaginatedResponseDto> {
    try {
      // Search query setup
      const searchQuery: Record<string, any> = {};
      if (Name) {
        searchQuery["name"] = { $regex: Name, $options: "i" };
      }

      // Pagination setup
      const skip = (Page - 1) * PageSize;

      const totalRecords = await this._spaceTypeRepository.count(searchQuery);
      const result = await this._spaceTypeRepository.find(searchQuery, {
        skip,
        limit: PageSize,
      });

      return new PaginatedResponseDto(totalRecords, Page, PageSize, result);
    } catch (error) {
      this._logger.error("Error finding all document:", error);
      throw new BadRequestException("Could not get all document");
    }
  }

  async findOne(id: string): Promise<SuccessResponseDto> {
    const result = await this._spaceTypeRepository.findById(id, {
      populate: [
        {
          path: "createdBy",
          select: "id email fullName",
        },
        {
          path: "updatedBy",
          select: "id email fullName",
        },
      ],
    });

    if (!result) {
      this._logger.error(`Document not found with ID: ${id}`);
      throw new NotFoundException(`Could not find document with ID: ${id}`);
    }

    return new SuccessResponseDto("Document found successfully", result);
  }

  async update(
    id: string,
    updateSpaceTypeDto: UpdateSpaceTypeDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const updatedSpaceType = await this._spaceTypeRepository.updateOneById(
        id,
        {
          ...updateSpaceTypeDto,
          updatedBy: userId,
          updatedAt: new Date(),
        },
      );

      return new SuccessResponseDto(
        "Document updated successfully",
        updatedSpaceType,
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
    const result = await this._spaceTypeRepository.removeOneById(id);

    if (!result) {
      this._logger.error(`Document not deleted with ID: ${id}`);
      throw new BadRequestException(`Could not delete document with ID: ${id}`);
    }

    return new SuccessResponseDto("Document deleted successfully");
  }
}
