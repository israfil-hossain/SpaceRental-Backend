import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { NameIdResponseDto } from "../common/dto/name-id-respones.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateSpaceSecurityDto } from "./dto/create-space-security.dto";
import { SpaceSecurityRepository } from "./space-security.repository";

@Injectable()
export class SpaceSecurityService {
  private readonly logger: Logger = new Logger(SpaceSecurityService.name);

  constructor(
    private readonly spaceSecurityRepository: SpaceSecurityRepository,
  ) {}

  async create(
    createSpaceDto: CreateSpaceSecurityDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const result = await this.spaceSecurityRepository.create({
        ...createSpaceDto,
        createdBy: userId,
      });

      const response = new NameIdResponseDto(result.id, result.name);

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
      const results = await this.spaceSecurityRepository.findAll();

      return new SuccessResponseDto("All document fetched", results);
    } catch (error) {
      this.logger.error("Error finding all document:", error);
      throw new BadRequestException("Could not get all document");
    }
  }

  async remove(id: string): Promise<SuccessResponseDto> {
    const result = await this.spaceSecurityRepository.removeOneById(id);

    if (!result) {
      this.logger.error(`Document not delete with ID: ${id}`);
      throw new BadRequestException(`Could not delete document with ID: ${id}`);
    }

    return new SuccessResponseDto("Document deleted successfully");
  }

  async findAllForDropdown() {
    try {
      const result = await this.spaceSecurityRepository.findAllForDropdown();

      return new SuccessResponseDto("All document fetched", result);
    } catch (error) {
      this.logger.error("Error in findAllForDropdown:", error);
      throw new BadRequestException("Could not get all document");
    }
  }
}
