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
  SpaceScheduleFeature,
  SpaceScheduleFeatureModelType,
} from "./entities/space-schedule-feature";
import {
  SpaceSecurityFeature,
  SpaceSecurityFeatureModelType,
} from "./entities/space-security-feature";
import {
  StorageConditionFeature,
  StorageConditionFeatureModelType,
} from "./entities/storage-condition-feature";
import {
  UnloadingMovingFeature,
  UnloadingMovingFeatureModelType,
} from "./entities/unloading-moving-feature";

@Injectable()
export class SpaceFeaturesService {
  private readonly _logger: Logger = new Logger(SpaceFeaturesService.name);

  constructor(
    @InjectModel(StorageConditionFeature.name)
    private _storageConditionFeatureModel: StorageConditionFeatureModelType,
    @InjectModel(UnloadingMovingFeature.name)
    private _unloadingMovingFeature: UnloadingMovingFeatureModelType,
    @InjectModel(SpaceSecurityFeature.name)
    private _spaceSecurityFeature: SpaceSecurityFeatureModelType,
    @InjectModel(SpaceScheduleFeature.name)
    private _spaceScheduleFeature: SpaceScheduleFeatureModelType,
  ) {}

  //#region Storage Condition Feature Service
  async createStorageCondition(
    createSpaceFeatureDto: CreateSpaceFeatureDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const newSpaceType = new this._storageConditionFeatureModel({
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

  async findAllStorageCondition(): Promise<SuccessResponseDto> {
    try {
      const results = await this._storageConditionFeatureModel.find().exec();

      return new SuccessResponseDto("All document fetched", results);
    } catch (error) {
      this._logger.error("Error finding all document:", error);
      throw new BadRequestException("Could not get all document");
    }
  }

  async removeStorageCondition(id: string): Promise<SuccessResponseDto> {
    const result = await this._storageConditionFeatureModel
      .findByIdAndDelete(id)
      .exec();

    if (!result) {
      throw new BadRequestException(`Could not delete document with ID: ${id}`);
    }

    return new SuccessResponseDto("Document deleted successfully");
  }
  //#endregion

  //#region Unloading and Moving Feature Service
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
      throw new BadRequestException(`Could not delete document with ID: ${id}`);
    }

    return new SuccessResponseDto("Document deleted successfully");
  }
  //#endregion

  //#region Space Security Feature Service
  async createSpaceSecurity(
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

  async findAllSpaceSecurity(): Promise<SuccessResponseDto> {
    try {
      const results = await this._spaceSecurityFeature.find().exec();

      return new SuccessResponseDto("All document fetched", results);
    } catch (error) {
      this._logger.error("Error finding all document:", error);
      throw new BadRequestException("Could not get all document");
    }
  }

  async removeSpaceSecurity(id: string): Promise<SuccessResponseDto> {
    const result = await this._spaceSecurityFeature
      .findByIdAndDelete(id)
      .exec();

    if (!result) {
      throw new BadRequestException(`Could not delete document with ID: ${id}`);
    }

    return new SuccessResponseDto("Document deleted successfully");
  }
  //#endregion

  //#region Space Schedule Feature Service
  async createSpaceSchedule(
    createSpaceFeatureDto: CreateSpaceFeatureDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const newSpaceType = new this._spaceScheduleFeature({
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

  async findAllSpaceSchedule(): Promise<SuccessResponseDto> {
    try {
      const results = await this._spaceScheduleFeature.find().exec();

      return new SuccessResponseDto("All document fetched", results);
    } catch (error) {
      this._logger.error("Error finding all document:", error);
      throw new BadRequestException("Could not get all document");
    }
  }

  async removeSpaceSchedule(id: string): Promise<SuccessResponseDto> {
    const result = await this._spaceScheduleFeature
      .findByIdAndDelete(id)
      .exec();

    if (!result) {
      throw new BadRequestException(`Could not delete document with ID: ${id}`);
    }

    return new SuccessResponseDto("Document deleted successfully");
  }
  //#endregion
}
