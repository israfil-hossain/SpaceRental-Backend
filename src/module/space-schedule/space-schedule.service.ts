import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateSpaceScheduleDto } from "./dto/create-space-schedule.dto";
import {
  SpaceSchedule,
  SpaceScheduleType,
} from "./entities/space-schedule.entity";

@Injectable()
export class SpaceScheduleService {
  private readonly _logger: Logger = new Logger(SpaceScheduleService.name);

  constructor(
    @InjectModel(SpaceSchedule.name)
    private _spaceSchedule: SpaceScheduleType,
  ) {}

  async create(
    createSpaceFeatureDto: CreateSpaceScheduleDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const newSpaceType = new this._spaceSchedule({
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
      const results = await this._spaceSchedule.find().exec();

      return new SuccessResponseDto("All document fetched", results);
    } catch (error) {
      this._logger.error("Error finding all document:", error);
      throw new BadRequestException("Could not get all document");
    }
  }

  async remove(id: string): Promise<SuccessResponseDto> {
    const result = await this._spaceSchedule.findByIdAndDelete(id).exec();

    if (!result) {
      this._logger.error(`Document not deleted with ID: ${id}`);
      throw new BadRequestException(`Could not delete document with ID: ${id}`);
    }

    return new SuccessResponseDto("Document deleted successfully");
  }

  //#region InternalMethods
  //#endregion
}
