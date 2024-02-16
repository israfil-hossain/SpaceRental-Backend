import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { FilterQuery } from "mongoose";
import { ApplicationUserRoleEnum } from "../application-user/enum/application-user-role.enum";
import { PaginatedResponseDto } from "../common/dto/paginated-response.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { SpaceForRentRepository } from "../space-for-rent/space-for-rent.repository";
import { CreateSpaceReviewDto } from "./dto/create-space-review.dto";
import { ListSpaceReviewQuery } from "./dto/list-space-review-query.dto";
import { SpaceReviewDocument } from "./entities/space-review.entity";
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
      if (error instanceof HttpException) throw error;

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

      const result = await this.spaceReviewRepository.getAll(
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
      if (error instanceof HttpException) throw error;

      this.logger.error("Error finding all document:", error);
      throw new BadRequestException("Could not get all document");
    }
  }

  async findAllBySpaceId(spaceId: string): Promise<SuccessResponseDto> {
    try {
      const result = await this.spaceReviewRepository.getAll(
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
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error("Error finding all document:", error);
      throw new BadRequestException(
        "Could not get all document with Space ID: " + spaceId,
      );
    }
  }

  // update(id: number, updateSpaceReviewDto: UpdateSpaceReviewDto) {
  //   return `This action updates a #${id} spaceReview`;
  // }

  async remove(
    id: string,
    userId: string,
    userRole: string,
  ): Promise<SuccessResponseDto> {
    try {
      const searchQuery: FilterQuery<SpaceReviewDocument> = {
        _id: id,
      };

      // Check if the user is not SUPER_ADMIN or ADMIN
      if (userRole !== ApplicationUserRoleEnum.ADMIN.toString()) {
        searchQuery.reviewer = userId;
      }
      const result = await this.spaceReviewRepository.getOneWhere(searchQuery);

      if (!result) {
        throw new NotFoundException(
          "No document was found to delete with ID: " + id,
        );
      }

      await this.spaceReviewRepository.removeOneById(result.id);

      return new SuccessResponseDto("Document deleted successfully");
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error(`Error deleting document with ID: ${id}`, error);
      throw new BadRequestException(`Could not delete document with ID: ${id}`);
    }
  }
}
