import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateSpaceFeatureDto } from "./dto/create-space-feature.dto";
import {
  SpaceSecurityFeature,
  SpaceSecurityFeatureModelType,
} from "./entities/space-security-feature";

@Injectable()
export class SpaceSecurityService {
  private readonly _logger: Logger = new Logger(SpaceSecurityService.name);

  constructor(
    @InjectModel(SpaceSecurityFeature.name)
    private _spaceSecurityFeature: SpaceSecurityFeatureModelType,
  ) {}

  async create(
    createSpaceFeatureDto: CreateSpaceFeatureDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const newSpaceType = new this._spaceSecurityFeature({
        ...createSpaceFeatureDto,
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
      const results = await this._spaceSecurityFeature.find().exec();

      return new SuccessResponseDto("All document fetched", results);
    } catch (error) {
      this._logger.error("Error finding all document:", error);
      throw new BadRequestException("Could not get all document");
    }
  }

  async remove(id: string): Promise<SuccessResponseDto> {
    const result = await this._spaceSecurityFeature
      .findByIdAndDelete(id)
      .exec();

    if (!result) {
      this._logger.error(`Document not delete with ID: ${id}`);
      throw new BadRequestException(`Could not delete document with ID: ${id}`);
    }

    return new SuccessResponseDto("Document deleted successfully");
  }
}
