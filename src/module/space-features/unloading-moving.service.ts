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
  UnloadingMovingFeature,
  UnloadingMovingFeatureModelType,
} from "./entities/unloading-moving-feature";

@Injectable()
export class UnloadingMovingService {
  private readonly _logger: Logger = new Logger(UnloadingMovingService.name);

  constructor(
    @InjectModel(UnloadingMovingFeature.name)
    private _unloadingMovingFeature: UnloadingMovingFeatureModelType,
  ) {}

  async createUnloadingMoving(
    createSpaceFeatureDto: CreateSpaceFeatureDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const newSpaceType = new this._unloadingMovingFeature({
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

  async findAllUnloadingMoving(): Promise<SuccessResponseDto> {
    try {
      const results = await this._unloadingMovingFeature.find().exec();

      return new SuccessResponseDto("All document fetched", results);
    } catch (error) {
      this._logger.error("Error finding all document:", error);
      throw new BadRequestException("Could not get all document");
    }
  }

  async removeUnloadingMoving(id: string): Promise<SuccessResponseDto> {
    const result = await this._unloadingMovingFeature
      .findByIdAndDelete(id)
      .exec();

    if (!result) {
      this._logger.error(`Document not delete with ID: ${id}`);
      throw new BadRequestException(`Could not delete document with ID: ${id}`);
    }

    return new SuccessResponseDto("Document deleted successfully");
  }
}
