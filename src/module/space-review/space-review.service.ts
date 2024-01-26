import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ApplicationUserRoleEnum } from "../application-user/enum/application-user-role.enum";
import { PaginatedResponseDto } from "../common/dto/paginated-response.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { SpaceForRentRepository } from "../space-for-rent/space-for-rent.repository";
import { CreateSpaceReviewDto } from "./dto/create-space-review.dto";
import { ListSpaceReviewQuery } from "./dto/list-space-review-query.dto";
import { SpaceReviewRepository } from "./space-review.repository";

@Injectable()
export class SpaceReviewService {
  private readonly logger: Logger = new Logger(SpaceReviewService.name);

  constructor(
    private readonly spaceReviewRepository: SpaceReviewRepository,
    private readonly spaceForRentRepository: SpaceForRentRepository,
  ) {}

  async create(
    createSpaceReviewDto: CreateSpaceReviewDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      // validate relations
      if (createSpaceReviewDto.space) {
        await this.spaceForRentRepository.validateObjectIds([
          createSpaceReviewDto.space,
        ]);
      }

      const newItem = await this.spaceReviewRepository.create({
        ...createSpaceReviewDto,
        reviewer: userId,
        createdBy: userId,
      });

      return new SuccessResponseDto("Document created successfully", newItem);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      if (error?.name === "MongoServerError" && error?.code === 11000) {
        this.logger.error("Duplicate key error:", error);
        throw new ConflictException("Document already exists");
      }

      this.logger.error("Error creating new document:", error);
      throw new BadRequestException("Error creating new document");
    }
  }

  async findAll({
    Page = 1,
    PageSize = 10,
  }: ListSpaceReviewQuery): Promise<PaginatedResponseDto> {
    try {
      // Pagination setup
      const totalRecords = await this.spaceReviewRepository.count();
      const skip = (Page - 1) * PageSize;

      const result = await this.spaceReviewRepository.find(
        {},
        {
          skip,
          limit: PageSize,
          populate: [
            {
              path: "reviewer",
              select: "id email fullName profilePicture",
            },
          ],
        },
      );

      return new PaginatedResponseDto(totalRecords, Page, PageSize, result);
    } catch (error) {
      this.logger.error("Error finding all document:", error);
      throw new BadRequestException("Could not get all document");
    }
  }

  async findAllBySpaceId(spaceId: string): Promise<SuccessResponseDto> {
    const result = await this.spaceReviewRepository.find(
      {
        space: spaceId,
      },
      {
        populate: [
          {
            path: "reviewer",
            select: "id email fullName profilePicture",
          },
        ],
      },
    );

    if (!result.length) {
      this.logger.error(`No document found with Space ID: ${spaceId}`);
      throw new NotFoundException(
        `Could not find any document with Space ID: ${spaceId}`,
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
        ApplicationUserRoleEnum.ADMIN.toString(),
        ApplicationUserRoleEnum.AGENT.toString(),
      ].includes(userRole)
    ) {
      searchQuery["reviewer"] = userId;
    }

    try {
      const result = await this.spaceReviewRepository.findOneWhere(searchQuery);

      if (!result) {
        throw new Error("No deleted document was found");
      }

      await this.spaceReviewRepository.removeOneById(result.id);

      return new SuccessResponseDto("Document deleted successfully");
    } catch (error) {
      this.logger.error(`Error deleting document with ID: ${id}`, error);
      throw new BadRequestException(`Could not delete document with ID: ${id}`);
    }
  }
}
