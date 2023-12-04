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
  private readonly logger: Logger = new Logger(SpaceFeaturesService.name);

  constructor(
    @InjectModel(StorageConditionFeature.name)
    private storageConditionFeatureModel: StorageConditionFeatureModelType,
    @InjectModel(UnloadingMovingFeature.name)
    private unloadingMovingFeature: UnloadingMovingFeatureModelType,
    @InjectModel(SpaceSecurityFeature.name)
    private spaceSecurityFeature: SpaceSecurityFeatureModelType,
    @InjectModel(SpaceScheduleFeature.name)
    private spaceScheduleFeature: SpaceScheduleFeatureModelType,
  ) {}

  //#region Storage Condition Feature Service
  async createStorageCondition(
    createSpaceFeatureDto: CreateSpaceFeatureDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const newSpaceType = new this.storageConditionFeatureModel({
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
        this.logger.error("Duplicate key error:", error);
        throw new ConflictException("Document already exists");
      }

      this.logger.error("Error creating new document:", error);
      throw new BadRequestException("Error creating new document");
    }
  }

  async findAllStorageCondition(): Promise<SuccessResponseDto> {
    try {
      const results = await this.storageConditionFeatureModel.find().exec();

      return new SuccessResponseDto("All document fetched", results);
    } catch (error) {
      this.logger.error("Error finding all document:", error);
      throw new BadRequestException("Could not get all document");
    }
  }

  async removeStorageCondition(id: string): Promise<SuccessResponseDto> {
    const result = await this.storageConditionFeatureModel
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
      const newSpaceType = new this.unloadingMovingFeature({
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
        this.logger.error("Duplicate key error:", error);
        throw new ConflictException("Document already exists");
      }

      this.logger.error("Error creating new document:", error);
      throw new BadRequestException("Error creating new document");
    }
  }

  async findAllUnloadingMoving(): Promise<SuccessResponseDto> {
    try {
      const results = await this.unloadingMovingFeature.find().exec();

      return new SuccessResponseDto("All document fetched", results);
    } catch (error) {
      this.logger.error("Error finding all document:", error);
      throw new BadRequestException("Could not get all document");
    }
  }

  async removeUnloadingMoving(id: string): Promise<SuccessResponseDto> {
    const result = await this.unloadingMovingFeature
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
      const newSpaceType = new this.spaceSecurityFeature({
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
        this.logger.error("Duplicate key error:", error);
        throw new ConflictException("Document already exists");
      }

      this.logger.error("Error creating new document:", error);
      throw new BadRequestException("Error creating new document");
    }
  }

  async findAllSpaceSecurity(): Promise<SuccessResponseDto> {
    try {
      const results = await this.spaceSecurityFeature.find().exec();

      return new SuccessResponseDto("All document fetched", results);
    } catch (error) {
      this.logger.error("Error finding all document:", error);
      throw new BadRequestException("Could not get all document");
    }
  }

  async removeSpaceSecurity(id: string): Promise<SuccessResponseDto> {
    const result = await this.spaceSecurityFeature.findByIdAndDelete(id).exec();

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
      const newSpaceType = new this.spaceScheduleFeature({
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
        this.logger.error("Duplicate key error:", error);
        throw new ConflictException("Document already exists");
      }

      this.logger.error("Error creating new document:", error);
      throw new BadRequestException("Error creating new document");
    }
  }

  async findAllSpaceSchedule(): Promise<SuccessResponseDto> {
    try {
      const results = await this.spaceScheduleFeature.find().exec();

      return new SuccessResponseDto("All document fetched", results);
    } catch (error) {
      this.logger.error("Error finding all document:", error);
      throw new BadRequestException("Could not get all document");
    }
  }

  async removeSpaceSchedule(id: string): Promise<SuccessResponseDto> {
    const result = await this.spaceScheduleFeature.findByIdAndDelete(id).exec();

    if (!result) {
      throw new BadRequestException(`Could not delete document with ID: ${id}`);
    }

    return new SuccessResponseDto("Document deleted successfully");
  }
  //#endregion
}
