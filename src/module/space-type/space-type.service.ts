import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { UpdateQuery } from "mongoose";
import { IdNameResponseDto } from "../common/dto/id-name-respones.dto";
import { PaginatedResponseDto } from "../common/dto/paginated-response.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateSpaceTypeDto } from "./dto/create-space-type.dto";
import { ListSpaceTypeQuery } from "./dto/list-space-type-query.dto";
import { UpdateSpaceTypeDto } from "./dto/update-space-type.dto";
import { SpaceTypeDocument } from "./entities/space-type.entity";
import { SpaceTypeRepository } from "./space-type.repository";

@Injectable()
export class SpaceTypeService {
  private readonly logger: Logger = new Logger(SpaceTypeService.name);

  constructor(private readonly spaceTypeRepository: SpaceTypeRepository) {}

  async create(
    createSpaceTypeDto: CreateSpaceTypeDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const result = await this.spaceTypeRepository.create({
        ...createSpaceTypeDto,
        createdBy: userId,
      });

      const response = new IdNameResponseDto(result.id, result.name);

      return new SuccessResponseDto("Document created successfully", response);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error("Error creating new document:", error);
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
      const searchQuery: UpdateQuery<SpaceTypeDocument> = {};

      if (Name) {
        searchQuery["name"] = { $regex: Name, $options: "i" };
      }

      // Pagination setup
      const skip = (Page - 1) * PageSize;

      const totalRecords = await this.spaceTypeRepository.count(searchQuery);
      const result = await this.spaceTypeRepository.getAll(searchQuery, {
        skip,
        limit: PageSize,
      });

      return new PaginatedResponseDto(totalRecords, Page, PageSize, result);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error("Error finding all document:", error);
      throw new BadRequestException("Could not get all document");
    }
  }

  async findOne(id: string): Promise<SuccessResponseDto> {
    try {
      const result = await this.spaceTypeRepository.getOneById(id, {
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
        this.logger.error(`Document not found with ID: ${id}`);
        throw new NotFoundException(`Could not find document with ID: ${id}`);
      }

      return new SuccessResponseDto("Document found successfully", result);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error("Error finding document:", error);
      throw new BadRequestException("Could not get document");
    }
  }

  async update(
    id: string,
    updateSpaceTypeDto: UpdateSpaceTypeDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const updatedSpaceType = await this.spaceTypeRepository.updateOneById(
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
      if (error instanceof HttpException) throw error;

      this.logger.error("Error updating document:", error);
      throw new BadRequestException("Error updating document");
    }
  }

  async remove(id: string): Promise<SuccessResponseDto> {
    try {
      const result = await this.spaceTypeRepository.removeOneById(id);

      if (!result) {
        this.logger.error(`Document not found with ID: ${id}`);
        throw new BadRequestException(
          `Could not delete document with ID: ${id}`,
        );
      }

      return new SuccessResponseDto("Document deleted successfully");
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error("Error deleting document:", error);
      throw new BadRequestException("Error deleting document");
    }
  }

  async findAllForDropdown() {
    try {
      const result = await this.spaceTypeRepository.getAll(
        {},
        { projection: { value: "$_id", label: "$name", _id: 0 } },
      );

      return new SuccessResponseDto("All document fetched", result);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error("Error in findAllForDropdown:", error);
      throw new BadRequestException("Could not get all document");
    }
  }
}
