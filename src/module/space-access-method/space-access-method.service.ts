import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { IdNameResponseDto } from "../common/dto/id-name-respones.dto";
import { PaginatedResponseDto } from "../common/dto/paginated-response.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateSpaceAccessMethodDto } from "./dto/create-space-access-method.dto";
import { ListSpaceAccessMethodQuery } from "./dto/list-space-access-method-query.dto";
import { UpdateSpaceAccessMethodDto } from "./dto/update-space-access-method.dto";
import { SpaceAccessMethodRepository } from "./space-access-method.repository";

@Injectable()
export class SpaceAccessMethodService {
  private readonly logger: Logger = new Logger(SpaceAccessMethodService.name);

  constructor(
    private readonly spaceAccessMethodRepository: SpaceAccessMethodRepository,
  ) {}

  async create(
    createSpaceAccessMethodDto: CreateSpaceAccessMethodDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const result = await this.spaceAccessMethodRepository.create({
        ...createSpaceAccessMethodDto,
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
    PageSize: limit = 10,
    Name = "",
  }: ListSpaceAccessMethodQuery): Promise<PaginatedResponseDto> {
    try {
      // Search query setup
      const searchQuery: Record<string, any> = {};
      if (Name) {
        searchQuery["name"] = { $regex: Name, $options: "i" };
      }

      const count = await this.spaceAccessMethodRepository.count(searchQuery);
      const skip = (Page - 1) * limit;

      const result = await this.spaceAccessMethodRepository.getAll(
        searchQuery,
        {
          limit,
          skip,
        },
      );

      return new PaginatedResponseDto(count, Page, limit, result);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error("Error finding all document:", error);
      throw new BadRequestException("Could not get all document");
    }
  }

  async findOne(id: string): Promise<SuccessResponseDto> {
    try {
      const result = await this.spaceAccessMethodRepository.getOneById(id, {
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
    updateSpaceAccessMethodDto: UpdateSpaceAccessMethodDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const result = await this.spaceAccessMethodRepository.updateOneById(
        id,
        {
          ...updateSpaceAccessMethodDto,
          updatedBy: userId,
          updatedAt: new Date(),
        },
        { new: true },
      );

      if (!result) {
        this.logger.error(`Document not found with ID: ${id}`);
        throw new NotFoundException(`Could not find document with ID: ${id}`);
      }

      return new SuccessResponseDto("Document updated successfully", result);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error("Error updating document:", error);
      throw new BadRequestException("Error updating document");
    }
  }

  async remove(id: string): Promise<SuccessResponseDto> {
    try {
      const result = await this.spaceAccessMethodRepository.removeOneById(id);

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
      const result = await this.spaceAccessMethodRepository.getAll(
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

  //#region InternalMethods
  //#endregion
}
