import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { IdNameResponseDto } from "../common/dto/id-name-respones.dto";
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

      const response = new IdNameResponseDto(result.id, result.name);

      return new SuccessResponseDto("Document created successfully", response);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error("Error creating new document:", error);
      throw new BadRequestException("Error creating new document");
    }
  }

  async findAll(): Promise<SuccessResponseDto> {
    try {
      const results = await this.spaceScheduleRepository.getAll();

      return new SuccessResponseDto("All document fetched", results);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error("Error finding all document:", error);
      throw new BadRequestException("Could not get all document");
    }
  }

  async remove(id: string): Promise<SuccessResponseDto> {
    try {
      const result = await this.spaceScheduleRepository.removeOneById(id);

      if (!result) {
        this.logger.error(`Document not deleted with ID: ${id}`);
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
      const result = await this.spaceScheduleRepository.getAll(
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
