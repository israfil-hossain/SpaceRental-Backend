import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateSpaceScheduleFeatureDto } from "./dto/create-space-schedule-feature.dto";
import {
  SpaceScheduleFeature,
  SpaceScheduleFeatureType,
} from "./entities/space-schedule-feature.entity";

@Injectable()
export class SpaceScheduleFeatureService {
  private readonly _logger: Logger = new Logger(
    SpaceScheduleFeatureService.name,
  );

  constructor(
    @InjectModel(SpaceScheduleFeature.name)
    private _spaceScheduleFeature: SpaceScheduleFeatureType,
  ) {}

  async create(
    createSpaceFeatureDto: CreateSpaceScheduleFeatureDto,
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

  async findAll(): Promise<SuccessResponseDto> {
    try {
      const results = await this._spaceScheduleFeature.find().exec();

      return new SuccessResponseDto("All document fetched", results);
    } catch (error) {
      this._logger.error("Error finding all document:", error);
      throw new BadRequestException("Could not get all document");
    }
  }

  async remove(id: string): Promise<SuccessResponseDto> {
    const result = await this._spaceScheduleFeature
      .findByIdAndDelete(id)
      .exec();

    if (!result) {
      this._logger.error(`Document not deleted with ID: ${id}`);
      throw new BadRequestException(`Could not delete document with ID: ${id}`);
    }

    return new SuccessResponseDto("Document deleted successfully");
  }

  //#region InternalMethods
  async validateObjectIds(listOfIds: string[] = []): Promise<void> {
    const result = await this._spaceScheduleFeature
      .find({ _id: { $in: listOfIds } })
      .select("_id")
      .exec();

    if (listOfIds.length !== result.length) {
      this._logger.error(`Invalid space schedule IDs: ${listOfIds}`);
      throw new BadRequestException("Invalid space schedule IDs");
    }
  }
  //#endregion
}
