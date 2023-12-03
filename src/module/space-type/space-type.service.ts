import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PaginatedResponseDto } from "../common/dto/paginated-response.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateSpaceTypeDto } from "./dto/create-space-type.dto";
import { SpaceTypeListQuery } from "./dto/space-type-list-query.dto";
import { UpdateSpaceTypeDto } from "./dto/update-space-type.dto";
import { SpaceType, SpaceTypeModelType } from "./entities/space-type.entity";

@Injectable()
export class SpaceTypeService {
  private readonly logger: Logger = new Logger("SpaceTypeService");

  constructor(
    @InjectModel(SpaceType.name) private spaceTypeModel: SpaceTypeModelType,
  ) {}

  async create(
    createSpaceTypeDto: CreateSpaceTypeDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const newSpaceType = new this.spaceTypeModel({
        ...createSpaceTypeDto,
        createdBy: userId,
      });
      await newSpaceType.save();

      return new SuccessResponseDto(
        "Space Type created successfully",
        newSpaceType,
      );
    } catch (error) {
      if (error?.name === "MongoServerError" && error?.code === 11000) {
        this.logger.error("Duplicate key error:", error);
        throw new ConflictException("Space Type already exists");
      }

      this.logger.error("Error creating new space type:", error);
      throw new BadRequestException("Error creating new space type");
    }
  }

  async findAll({ Page = 1, PageSize = 10, Name = "" }: SpaceTypeListQuery) {
    try {
      // Pagination setup
      const totalRecords = await this.spaceTypeModel.countDocuments().exec();
      const skip = (Page - 1) * PageSize;

      // Search query setup
      const searchQuery: Record<string, any> = {};
      if (Name) {
        searchQuery["name"] = { $regex: Name, $options: "i" };
      }

      const result = await this.spaceTypeModel
        .where(searchQuery)
        .find()
        .skip(skip)
        .limit(PageSize)
        .exec();

      return new PaginatedResponseDto(totalRecords, Page, PageSize, result);
    } catch (error) {
      this.logger.error("Error finding all space type:", error);
      throw new BadRequestException("Could not get all space type");
    }
  }

  async findOne(id: string) {
    const result = await this.spaceTypeModel
      .findById(id)
      .populate([
        {
          path: "createdBy",
          select: "id email fullName",
        },
        {
          path: "updatedBy",
          select: "id email fullName",
        },
      ])
      .exec();

    if (!result) {
      throw new NotFoundException(`Could not find space type with ID: ${id}`);
    }

    return new SuccessResponseDto("Space Type found successfully", result);
  }

  async update(
    id: string,
    updateSpaceTypeDto: UpdateSpaceTypeDto,
    userId: string,
  ) {
    try {
      const updatedSpaceType = await this.spaceTypeModel
        .findByIdAndUpdate(
          id,
          {
            ...updateSpaceTypeDto,
            updatedBy: userId,
            updatedAt: new Date(),
          },
          { new: true },
        )
        .exec();

      if (!updatedSpaceType) {
        throw new NotFoundException(`Could not find space type with ID: ${id}`);
      }

      return new SuccessResponseDto(
        "Space Type updated successfully",
        updatedSpaceType,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error.name === "MongoError" && error.code === 11000) {
        this.logger.error("Duplicate key error:", error);
        throw new ConflictException("Space Type already exists");
      }

      this.logger.error("Error updating space type:", error);
      throw new BadRequestException("Error updating space type");
    }
  }

  async remove(id: string) {
    const result = await this.spaceTypeModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new BadRequestException(
        `Could not delete space type with ID: ${id}`,
      );
    }

    return new SuccessResponseDto("Space Type deleted successfully");
  }
}
