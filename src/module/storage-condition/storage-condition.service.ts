import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { IdNameResponseDto } from "../common/dto/id-name-respones.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateStorageConditionDto } from "./dto/create-storage-condition.dto";
import { StorageConditionRepository } from "./storage-condition.repository";

@Injectable()
export class StorageConditionService {
  private readonly logger: Logger = new Logger(StorageConditionService.name);

  constructor(
    private readonly storageConditionRepository: StorageConditionRepository,
  ) {}

  async create(
    createSpaceDto: CreateStorageConditionDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const result = await this.storageConditionRepository.create({
        ...createSpaceDto,
        createdBy: userId,
      });

      const response = new IdNameResponseDto(result.id, result.name);

      return new SuccessResponseDto("Document created successfully", response);
    } catch (error) {
      if (error?.name === "MongoServerError" && error?.code === 11000) {
        this.logger.error("Duplicate key error:", error);
        throw new ConflictException("Document already exists");
      }

      this.logger.error("Error creating new document:", error);
      throw new BadRequestException("Error creating new document");
    }
  }

  async findAll(): Promise<SuccessResponseDto> {
    try {
      const results = await this.storageConditionRepository.getAll();

      return new SuccessResponseDto("All document fetched", results);
    } catch (error) {
      this.logger.error("Error finding all document:", error);
      throw new BadRequestException("Could not get all document");
    }
  }

  async remove(id: string): Promise<SuccessResponseDto> {
    const result = await this.storageConditionRepository.removeOneById(id);

    if (!result) {
      this.logger.error(`Document not delete with ID: ${id}`);
      throw new BadRequestException(`Could not delete document with ID: ${id}`);
    }

    return new SuccessResponseDto("Document deleted successfully");
  }

  async findAllForDropdown() {
    try {
      const result = await this.storageConditionRepository.findAllForDropdown();

      return new SuccessResponseDto("All document fetched", result);
    } catch (error) {
      this.logger.error("Error in findAllForDropdown:", error);
      throw new BadRequestException("Could not get all document");
    }
  }
}
