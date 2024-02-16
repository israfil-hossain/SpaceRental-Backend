import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { IdNameResponseDto } from "../common/dto/id-name-respones.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateTermsConditionDto } from "./dto/create-terms-condition.dto";
import { UpdateTermsConditionDto } from "./dto/update-terms-condition.dto";
import { TermsConditionRepository } from "./terms-condition.repository";

@Injectable()
export class TermsConditionService {
  private readonly logger: Logger = new Logger(TermsConditionService.name);

  constructor(
    private readonly termsConditionRepository: TermsConditionRepository,
  ) {}

  async create(
    createTermsConditionDto: CreateTermsConditionDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const newItem = await this.termsConditionRepository.create({
        ...createTermsConditionDto,
        createdBy: userId,
      });

      const respones = new IdNameResponseDto(newItem.id, newItem.name);

      return new SuccessResponseDto(
        "New document created successfully",
        respones,
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error("Error creating new document:", error);
      throw new BadRequestException("Error creating new document");
    }
  }

  async findAll(): Promise<SuccessResponseDto> {
    try {
      const results = await this.termsConditionRepository.getAll();

      return new SuccessResponseDto("All document fetched", results);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error("Error finding all document:", error);
      throw new BadRequestException("Could not get all document");
    }
  }

  async update(
    id: string,
    updateTermsConditionDto: UpdateTermsConditionDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const result = await this.termsConditionRepository.updateOneById(id, {
        ...updateTermsConditionDto,
        updatedBy: userId,
        updatedAt: new Date(),
      });

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
      const result = await this.termsConditionRepository.removeOneById(id);

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
}
