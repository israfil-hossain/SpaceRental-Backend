import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { ApplicationUserRoleEnum } from "../application-user/enum/application-user-role.enum";
import { PaginatedResponseDto } from "../common/dto/paginated-response.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { ImageMetaService } from "../image-meta/image-meta.service";
import { AddSpaceImageDto } from "./dto/add-space-image.dto";
import { CreateSpaceForRentDto } from "./dto/create-space-for-rent.dto";
import { ListSpaceForRentQuery } from "./dto/list-space-for-rent-query.dto";
import { UpdateSpaceForRentDto } from "./dto/update-space-for-rent.dto";
import { SpaceForRentRepository } from "./space-for-rent.repository";
import { SpaceForRentValidator } from "./space-for-rent.validator";

@Injectable()
export class SpaceForRentService {
  private readonly logger: Logger = new Logger(SpaceForRentService.name);

  constructor(
    private readonly spaceForRentRepository: SpaceForRentRepository,

    private readonly spaceForRentValidator: SpaceForRentValidator,
    private readonly imageService: ImageMetaService,
  ) {}

  async create(
    { spaceImages, ...createSpaceDto }: CreateSpaceForRentDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      // validate relations
      await this.spaceForRentValidator.validateSpaceRelatedIDs(createSpaceDto);

      // create new document
      const newItem = await this.spaceForRentRepository.create({
        ...createSpaceDto,
        createdBy: userId,
      });

      const createdImages = await this.imageService.createMultipleImages(
        spaceImages,
        newItem.id,
      );
      const spaceImagesIDs = createdImages.map((image) => image.id);

      const result = await this.spaceForRentRepository.updateOneById(
        newItem.id,
        {
          spaceImages: spaceImagesIDs,
        },
      );

      return new SuccessResponseDto("New Space created successfully", result);
    } catch (error) {
      if (
        error?.options?.cause === "RepositoryException" ||
        error?.options?.cause === "ValidatorException"
      ) {
        throw error;
      }

      this.logger.error("Error creating new document:", error);
      throw new BadRequestException("Error creating new document");
    }
  }

  async findAll(
    { Page = 1, PageSize = 10, Name = "" }: ListSpaceForRentQuery,
    userId: string,
    userRole: string,
  ): Promise<PaginatedResponseDto> {
    try {
      // Search query setup
      const searchQuery: Record<string, any> = {};

      if (Name) {
        searchQuery.name = { $regex: Name, $options: "i" };
      }

      if (userRole === ApplicationUserRoleEnum.OWNER.toString()) {
        searchQuery.createdBy = userId;
      } else if (userRole === ApplicationUserRoleEnum.RENTER.toString()) {
        searchQuery.isActive = true;
        searchQuery.isVerified = true;
      }

      // Pagination setup
      const totalRecords = await this.spaceForRentRepository.count(searchQuery);
      const skip = (Page - 1) * PageSize;

      const result = await this.spaceForRentRepository.findForCardView(
        searchQuery,
        skip,
        PageSize,
      );

      return new PaginatedResponseDto(totalRecords, Page, PageSize, result);
    } catch (error) {
      this.logger.error("Error finding all document:", error);
      throw new BadRequestException("Could not get all document");
    }
  }

  async findOne(id: string): Promise<SuccessResponseDto> {
    const result = await this.spaceForRentRepository.findOnePopulatedById(id);

    if (!result) {
      this.logger.error(`Document not found with ID: ${id}`);
      throw new NotFoundException(`Could not find document with ID: ${id}`);
    }

    return new SuccessResponseDto("Document found successfully", result);
  }

  async update(
    id: string,
    updateSpaceDto: UpdateSpaceForRentDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      // validate relations
      await this.spaceForRentValidator.validateSpaceRelatedIDs(updateSpaceDto);

      // update document
      const updatedItem = await this.spaceForRentRepository.updateOneById(id, {
        ...updateSpaceDto,
        updatedBy: userId,
        updatedAt: new Date(),
      });

      return new SuccessResponseDto(
        "Document updated successfully",
        updatedItem,
      );
    } catch (error) {
      if (
        error?.options?.cause === "RepositoryException" ||
        error?.options?.cause === "ValidatorException"
      ) {
        throw error;
      }

      this.logger.error("Error updating space document:", error);
      throw new BadRequestException("Error updating space document");
    }
  }

  async remove(id: string): Promise<SuccessResponseDto> {
    const result = await this.spaceForRentRepository.removeOneById(id);

    if (!result) {
      this.logger.error(`Document not deleted with ID: ${id}`);
      throw new BadRequestException(`Could not delete document with ID: ${id}`);
    }

    return new SuccessResponseDto("Document deleted successfully");
  }

  async addSpaceImage(
    id: string,
    addSpaceImageDto: AddSpaceImageDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const existingSpace = await this.spaceForRentRepository.findById(id);

      if (!existingSpace) {
        this.logger.error(`Document not found with ID: ${id}`);
        throw new NotFoundException(`Could not find space type with ID: ${id}`);
      }

      const createdImages = await this.imageService.createMultipleImages(
        addSpaceImageDto.spaceImages,
        existingSpace.id,
      );
      const spaceImagesIDs = createdImages.map((image) => image.id);
      const updatedImageIds = existingSpace.spaceImages.concat(spaceImagesIDs);

      const result = await this.spaceForRentRepository.updateOneById(id, {
        spaceImages: updatedImageIds,
        updatedBy: userId,
        updatedAt: new Date(),
      });

      if (!result) {
        this.logger.error(`Document not found with ID: ${id}`);
        throw new NotFoundException(`Could not find space type with ID: ${id}`);
      }

      return new SuccessResponseDto("Document updated successfully", result);
    } catch (error) {
      if (error?.options?.cause === "RepositoryException") {
        throw error;
      }

      this.logger.error("Error updating space document:", error);
      throw new BadRequestException("Error updating space document");
    }
  }

  async removeSpaceImage(
    imageId: string,
    spaceForRentId: string,
  ): Promise<SuccessResponseDto> {
    const existingSpaceForRent =
      await this.spaceForRentRepository.findById(spaceForRentId);

    if (!existingSpaceForRent) {
      throw new NotFoundException(
        `Could not find space for rent with ID: ${spaceForRentId}`,
      );
    }

    const result = await this.imageService.removeImage(imageId, spaceForRentId);

    if (!result) {
      this.logger.error(`Image not deleted with ID: ${imageId}`);
      throw new BadRequestException(
        `Could not delete image with ID: ${imageId}`,
      );
    }

    return new SuccessResponseDto("Image deleted successfully");
  }
}
