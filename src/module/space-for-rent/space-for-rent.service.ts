/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  HttpException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { FilterQuery } from "mongoose";
import { ApplicationUserRoleEnum } from "../application-user/enum/application-user-role.enum";
import { IdNameResponseDto } from "../common/dto/id-name-respones.dto";
import { PaginatedResponseDto } from "../common/dto/paginated-response.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { ImageMetaService } from "../image-meta/image-meta.service";
import { AddSpaceImageDto } from "./dto/add-space-image.dto";
import { CreateSpaceForRentDto } from "./dto/create-space-for-rent.dto";
import { ListSpaceForRentQuery } from "./dto/list-space-for-rent-query.dto";
import { UpdateSpaceForRentDto } from "./dto/update-space-for-rent.dto";
import { SpaceForRentDocument } from "./entities/space-for-rent.entity";
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
      const newSpace = await this.spaceForRentRepository.create({
        ...createSpaceDto,
        createdBy: userId,
      });

      const createdImages = await this.imageService.createMultipleImages(
        spaceImages,
        newSpace.id,
      );

      const spaceImagesIDs = createdImages.map((image) => image.id);
      await this.spaceForRentRepository.updateOneById(newSpace.id, {
        spaceImages: spaceImagesIDs,
      });

      const response = new IdNameResponseDto(newSpace.id, newSpace.name);
      return new SuccessResponseDto("New Space created successfully", response);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error("Error creating new document:", error);
      throw new BadRequestException("Error creating new document");
    }
  }

  async findAll(
    { Page = 1, PageSize = 10, ...queryFilters }: ListSpaceForRentQuery,
    userId: string,
    userRole: string,
  ): Promise<PaginatedResponseDto> {
    try {
      // Search query setup
      const searchQuery: FilterQuery<SpaceForRentDocument> = {};

      if (queryFilters.Name) {
        const escapedName = queryFilters.Name.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&",
        );
        const regex = new RegExp(
          `(?=.*${escapedName.split(/\s+/).join(")(?=.*")})`,
          "i",
        );
        searchQuery.name = { $regex: regex };
      }

      if (queryFilters.Location) {
        const escapedLocation = queryFilters.Location.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&",
        );
        const regex = new RegExp(
          `(?=.*${escapedLocation.split(/\s+/).join(")(?=.*")})`,
          "i",
        );
        searchQuery.location = { $regex: regex };
      }

      if (queryFilters.SpaceType) {
        searchQuery.type = queryFilters.SpaceType;
      }

      if (userRole === ApplicationUserRoleEnum.OWNER.toString()) {
        searchQuery.createdBy = userId;
      } else if (userRole === ApplicationUserRoleEnum.RENTER.toString()) {
        searchQuery.isActive = true;
        // searchQuery.isVerified = true;
      }

      // Pagination setup
      const totalRecords = await this.spaceForRentRepository.count(searchQuery);
      const skip = (Page - 1) * PageSize;

      const result = await this.spaceForRentRepository.findForCardView(
        searchQuery,
        skip,
        PageSize,
        userId,
      );

      return new PaginatedResponseDto(totalRecords, Page, PageSize, result);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error("Error finding all document:", error);
      throw new BadRequestException("Could not get all document");
    }
  }

  async findOne(id: string, userId?: string): Promise<SuccessResponseDto> {
    try {
      const result = await this.spaceForRentRepository.findOnePopulatedById(
        id,
        userId,
      );

      if (!result) {
        this.logger.error(`Document not found with ID: ${id}`);
        throw new NotFoundException(`Could not find document with ID: ${id}`);
      }

      return new SuccessResponseDto("Document found successfully", result);
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error("Error finding document:", error);
      throw new BadRequestException("Could not get document");
    }
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
      if (error instanceof HttpException) throw error;

      this.logger.error("Error updating new document:", error);
      throw new BadRequestException("Error updating new document");
    }
  }

  async remove(id: string): Promise<SuccessResponseDto> {
    try {
      const result = await this.spaceForRentRepository.removeOneById(id);

      if (!result) {
        this.logger.error(`Document not deleted with ID: ${id}`);
        throw new BadRequestException(
          `Could not delete document with ID: ${id}`,
        );
      }

      return new SuccessResponseDto("Document deleted successfully");
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error("Error deleting new document:", error);
      throw new BadRequestException("Error deleting new document");
    }
  }

  async addSpaceImage(
    id: string,
    addSpaceImageDto: AddSpaceImageDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const existingSpace = await this.spaceForRentRepository.getOneById(id);

      if (!existingSpace) {
        this.logger.error(`Document not found with ID: ${id}`);
        throw new NotFoundException(`Could not find space type with ID: ${id}`);
      }

      const createdImages = await this.imageService.createMultipleImages(
        addSpaceImageDto.spaceImages,
        existingSpace.id,
      );
      const spaceImagesIDs = createdImages.map((image) => image.id);

      const existingSpaceImageIds = Array.isArray(existingSpace.spaceImages)
        ? existingSpace.spaceImages
        : [];
      const updatedImageIds = existingSpaceImageIds.concat(spaceImagesIDs);

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
      if (error instanceof HttpException) throw error;

      this.logger.error("Error updating space document:", error);
      throw new BadRequestException("Error updating space document");
    }
  }

  async removeSpaceImage(
    imageId: string,
    spaceForRentId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const existingSpaceForRent =
        await this.spaceForRentRepository.getOneById(spaceForRentId);

      if (!existingSpaceForRent) {
        throw new NotFoundException(
          `Could not find space for rent with ID: ${spaceForRentId}`,
        );
      }

      const result = await this.imageService.removeImage(
        imageId,
        spaceForRentId,
      );

      if (!result) {
        this.logger.error(`Image not deleted with ID: ${imageId}`);
        throw new BadRequestException(
          `Could not delete image with ID: ${imageId}`,
        );
      }

      return new SuccessResponseDto("Image deleted successfully");
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error("Error deleting image:", error);
      throw new BadRequestException("Error deleting image");
    }
  }

  async addToFavorite(
    spaceForRentId: string,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const existingSpaceForRent =
        await this.spaceForRentRepository.getOneById(spaceForRentId);

      if (!existingSpaceForRent) {
        throw new NotFoundException(`Could not find space for rent`);
      }

      if (existingSpaceForRent.favorites?.includes(userId)) {
        existingSpaceForRent.favorites = existingSpaceForRent.favorites.filter(
          (id) => id !== userId,
        );
        await existingSpaceForRent.save();

        return new SuccessResponseDto(
          "Item removed from your favorite list successfully",
        );
      }

      existingSpaceForRent.favorites?.push(userId);
      await existingSpaceForRent.save();

      return new SuccessResponseDto(
        "Item added to your favorite list successfully",
      );
    } catch (error) {
      if (error instanceof HttpException) throw error;

      this.logger.error("Error adding to favorite item:", error);
      throw new BadRequestException("Error to adding favorite item");
    }
  }

  async getFavorites(userId: string): Promise<SuccessResponseDto> {
    try {
      const results =
        await this.spaceForRentRepository.getFavoriteItems(userId);
      return new SuccessResponseDto("Success", results);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      this.logger.error("Error getting favorite items:", error);
      throw new BadRequestException("Error getting favorite items");
    }
  }
}

