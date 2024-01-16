import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateUnloadingMovingDto } from "./dto/create-unloading-moving.dto";
import {
  UnloadingMoving,
  UnloadingMovingType,
} from "./entities/unloading-moving.entity";

@Injectable()
export class UnloadingMovingService {
  private readonly _logger: Logger = new Logger(UnloadingMovingService.name);

  constructor(
    @InjectModel(UnloadingMoving.name)
    private _unloadingMoving: UnloadingMovingType,
  ) {}

  async create(
    createSpaceDto: CreateUnloadingMovingDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const newSpaceType = new this._unloadingMoving({
        ...createSpaceDto,
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
      const results = await this._unloadingMoving.find().exec();

      return new SuccessResponseDto("All document fetched", results);
    } catch (error) {
      this._logger.error("Error finding all document:", error);
      throw new BadRequestException("Could not get all document");
    }
  }

  async remove(id: string): Promise<SuccessResponseDto> {
    const result = await this._unloadingMoving.findByIdAndDelete(id).exec();

    if (!result) {
      this._logger.error(`Document not delete with ID: ${id}`);
      throw new BadRequestException(`Could not delete document with ID: ${id}`);
    }

    return new SuccessResponseDto("Document deleted successfully");
  }

  //#region InternalMethods
  //#endregion
}
