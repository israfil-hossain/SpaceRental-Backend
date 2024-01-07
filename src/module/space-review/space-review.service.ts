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
import { SpaceForRentService } from "../space-for-rent/space-for-rent.service";
import { UserRoleEnum } from "../user/enum/user-role.enum";
import { CreateSpaceReviewDto } from "./dto/create-space-review.dto";
import { ListSpaceReviewQuery } from "./dto/list-space-review-query.dto";
import {
  SpaceReviewModel,
  SpaceReviewModelType,
} from "./entities/space-review.entity";

@Injectable()
export class SpaceReviewService {
  private readonly _logger: Logger = new Logger(SpaceReviewService.name);

  constructor(
    @InjectModel(SpaceReviewModel.name)
    private _spaceReviewModelType: SpaceReviewModelType,
    private _spaceForRentService: SpaceForRentService,
  ) {}

  async create(
    createSpaceReviewDto: CreateSpaceReviewDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      // validate relations
      if (createSpaceReviewDto.space) {
        await this._spaceForRentService.validateObjectId(
          createSpaceReviewDto.space,
        );
      }

      const newItem = new this._spaceReviewModelType({
        ...createSpaceReviewDto,
        reviewer: userId,
        createdBy: userId,
      });
      await newItem.save();

      return new SuccessResponseDto("Document created successfully", newItem);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      if (error?.name === "MongoServerError" && error?.code === 11000) {
        this._logger.error("Duplicate key error:", error);
        throw new ConflictException("Document already exists");
      }

      this._logger.error("Error creating new document:", error);
      throw new BadRequestException("Error creating new document");
    }
  }

  async findAll({
    Page = 1,
    PageSize = 10,
  }: ListSpaceReviewQuery): Promise<PaginatedResponseDto> {
    try {
      // Pagination setup
      const totalRecords = await this._spaceReviewModelType
        .countDocuments()
        .exec();
      const skip = (Page - 1) * PageSize;

      const result = await this._spaceReviewModelType
        .find()
        .skip(skip)
        .limit(PageSize)
        .populate([
          {
            path: "reviewer",
            select: "id email fullName profilePicture",
          },
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

      return new PaginatedResponseDto(totalRecords, Page, PageSize, result);
    } catch (error) {
      this._logger.error("Error finding all document:", error);
      throw new BadRequestException("Could not get all document");
    }
  }

  async findAllBySpaceId(id: string): Promise<SuccessResponseDto> {
    const result = await this._spaceReviewModelType
      .find({ space: id })
      .populate([
        {
          path: "reviewer",
          select: "id email fullName profilePicture",
        },
      ])
      .exec();

    if (!result.length) {
      this._logger.error(`No document found with Space ID: ${id}`);
      throw new NotFoundException(
        `Could not find any document with Space ID: ${id}`,
      );
    }

    return new SuccessResponseDto("Documents found successfully", result);
  }

  // update(id: number, updateSpaceReviewDto: UpdateSpaceReviewDto) {
  //   return `This action updates a #${id} spaceReview`;
  // }

  async remove(
    id: string,
    userId: string,
    userRole: string,
  ): Promise<SuccessResponseDto> {
    const searchQuery: Record<string, any> = {
      _id: id,
    };

    // Check if the user is not SUPER_ADMIN or ADMIN
    if (
      ![
        UserRoleEnum.SUPER_ADMIN.toString(),
        UserRoleEnum.ADMIN.toString(),
      ].includes(userRole)
    ) {
      searchQuery["reviewer"] = userId;
    }

    try {
      const result =
        await this._spaceReviewModelType.findOneAndDelete(searchQuery);

      if (!result) {
        throw new Error("No deleted document was found");
      }

      return new SuccessResponseDto("Document deleted successfully");
    } catch (error) {
      this._logger.error(`Error deleting document with ID: ${id}`, error);
      throw new BadRequestException(`Could not delete document with ID: ${id}`);
    }
  }
}
