import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateTermsConditionDto } from "./dto/create-terms-condition.dto";
import { UpdateTermsConditionDto } from "./dto/update-terms-condition.dto";
import {
  TermsCondition,
  TermsConditionType,
} from "./entities/terms-condition.entity";

@Injectable()
export class TermsConditionService {
  private readonly _logger: Logger = new Logger(TermsConditionService.name);

  constructor(
    @InjectModel(TermsCondition.name)
    private _termsCondition: TermsConditionType,
  ) {}

  async create(
    createTermsConditionDto: CreateTermsConditionDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const newSpaceType = new this._termsCondition({
        ...createTermsConditionDto,
        createdBy: userId,
      });
      await newSpaceType.save();

      return new SuccessResponseDto(
        "New document created successfully",
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

  async findAll(): Promise<SuccessResponseDto> {
    try {
      const results = await this._termsCondition.find().exec();

      return new SuccessResponseDto("All document fetched", results);
    } catch (error) {
      this._logger.error("Error finding all document:", error);
      throw new BadRequestException("Could not get all document");
    }
  }

  async update(
    id: string,
    updateTermsConditionDto: UpdateTermsConditionDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const result = await this._termsCondition
        .findByIdAndUpdate(
          id,
          {
            ...updateTermsConditionDto,
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
    const result = await this._termsCondition.findByIdAndDelete(id).exec();

    if (!result) {
      this._logger.error(`Document not delete with ID: ${id}`);
      throw new BadRequestException(`Could not delete document with ID: ${id}`);
    }

    return new SuccessResponseDto("Document deleted successfully");
  }
}
