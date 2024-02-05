import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { NameIdResponseDto } from "../common/dto/name-id-respones.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateSpaceScheduleDto } from "./dto/create-space-schedule.dto";
import { SpaceScheduleRepository } from "./space-schedule.repository";

@Injectable()
export class SpaceScheduleService {
  private readonly logger: Logger = new Logger(SpaceScheduleService.name);

  constructor(
    private readonly spaceScheduleRepository: SpaceScheduleRepository,
  ) {}

  async create(
    createSpaceFeatureDto: CreateSpaceScheduleDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const result = await this.spaceScheduleRepository.create({
        ...createSpaceFeatureDto,
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
      const results = await this.spaceScheduleRepository.findAll();

      return new SuccessResponseDto("All document fetched", results);
    } catch (error) {
      this.logger.error("Error finding all document:", error);
      throw new BadRequestException("Could not get all document");
    }
  }

  async remove(id: string): Promise<SuccessResponseDto> {
    const result = await this.spaceScheduleRepository.removeOneById(id);

    if (!result) {
      this.logger.error(`Document not deleted with ID: ${id}`);
      throw new BadRequestException(`Could not delete document with ID: ${id}`);
    }

    return new SuccessResponseDto("Document deleted successfully");
  }

  async findAllForDropdown() {
    try {
      const result = await this.spaceScheduleRepository.findAllForDropdown();

      return new SuccessResponseDto("All document fetched", result);
    } catch (error) {
      this.logger.error("Error in findAllForDropdown:", error);
      throw new BadRequestException("Could not get all document");
    }
  }
}
