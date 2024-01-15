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
import { ImageMeta } from "../image-meta/entities/image-meta.entity";
import { ImageMetaService } from "../image-meta/image-meta.service";
import { SpaceAccessOptionModel } from "../space-access-option/entities/space-access-option.entity";
import { SpaceAccessOptionService } from "../space-access-option/space-access-option.service";
import { SpaceReviewModel } from "../space-review/entities/space-review.entity";
import { SpaceScheduleFeature } from "../space-schedule-feature/entities/space-schedule-feature.entity";
import { SpaceScheduleFeatureService } from "../space-schedule-feature/space-schedule-feature.service";
import { SpaceSecurityFeature } from "../space-security-feature/entities/space-security-feature.entity";
import { SpaceSecurityFeatureService } from "../space-security-feature/space-security-feature.service";
import { SpaceTypeModel } from "../space-type/entities/space-type.entity";
import { SpaceTypeService } from "../space-type/space-type.service";
import { StorageConditionFeature } from "../storage-condition-feature/entities/storage-condition-feature.entity";
import { StorageConditionFeatureService } from "../storage-condition-feature/storage-condition-feature.service";
import { UnloadingMovingFeature } from "../unloading-moving-feature/entities/unloading-moving-feature.entity";
import { UnloadingMovingFeatureService } from "../unloading-moving-feature/unloading-moving-feature.service";
import { UserModel } from "../user/entities/user.entity";
import { UserRoleEnum } from "../user/enum/user-role.enum";
import { AddSpaceImageDto } from "./dto/add-space-image.dto";
import { CreateSpaceForRentDto } from "./dto/create-space-for-rent.dto";
import { ListSpaceForRentQuery } from "./dto/list-space-for-rent-query.dto";
import { UpdateSpaceForRentDto } from "./dto/update-space-for-rent.dto";
import {
  SpaceForRentModel,
  SpaceForRentModelType,
} from "./entities/space-for-rent.entity";

@Injectable()
export class SpaceForRentService {
  private readonly _logger: Logger = new Logger(SpaceForRentService.name);

  constructor(
    @InjectModel(SpaceForRentModel.name)
    private _spaceForRentModel: SpaceForRentModelType,

    private _spaceTypeService: SpaceTypeService,
    private _spaceAccessOptionService: SpaceAccessOptionService,
    private _storageConditionService: StorageConditionFeatureService,
    private _unloadingMovingService: UnloadingMovingFeatureService,
    private _spaceSecurityService: SpaceSecurityFeatureService,
    private _spaceScheduleService: SpaceScheduleFeatureService,
    private readonly _imageService: ImageMetaService,
  ) {}

  async create(
    createSpaceDto: CreateSpaceForRentDto,
    userId: string,
  ): Promise<SuccessResponseDto> {
    try {
      // validate relations
      await this._spaceTypeService.validateObjectId(createSpaceDto.type);
      await this._spaceAccessOptionService.validateObjectId(
        createSpaceDto.accessMethod,
      );
      await this._storageConditionService.validateObjectIds(
        createSpaceDto.storageConditions,
      );
      await this._unloadingMovingService.validateObjectIds(
        createSpaceDto.unloadingMovings,
      );
      await this._spaceSecurityService.validateObjectIds(
        createSpaceDto.spaceSecurities,
      );
      await this._spaceScheduleService.validateObjectIds(
        createSpaceDto.spaceSchedules,
      );

      // create new document
      const newItem = new this._spaceForRentModel({
        ...createSpaceDto,
        createdBy: userId,
      });

      const createdImages = await this._imageService.createMultipleImages(
        createSpaceDto.spaceImages,
        newItem.id,
      );
      const spaceImagesIDs = createdImages.map((image) => image.id);
      newItem.spaceImages = spaceImagesIDs;

      await newItem.save();
      return new SuccessResponseDto("New Space created successfully", newItem);
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

      if (userRole === UserRoleEnum.SPACE_OWNER.toString()) {
        searchQuery.createdBy = userId;
      } else if (userRole === UserRoleEnum.RENTER.toString()) {
        searchQuery.isActive = true;
        searchQuery.isVerifiedByAdmin = true;
      }

      // Pagination setup
      const totalRecords = await this._spaceForRentModel
        .countDocuments(searchQuery)
        .exec();
      const skip = (Page - 1) * PageSize;

      const result = await this._spaceForRentModel
        .aggregate()
        .match(searchQuery)
        .skip(skip)
        .limit(PageSize)
        .lookup({
          from: `${SpaceReviewModel.name.toLowerCase()}s`,
          let: { spaceId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toObjectId: "$space" }, "$$spaceId"],
                },
              },
            },
          ],
          as: "spaceReviews",
        })
        .addFields({
          reviewCount: { $size: "$spaceReviews" },
        })
        .addFields({
          averageRating: {
            $cond: {
              if: { $gt: ["$reviewCount", 0] },
              then: {
                $divide: [
                  {
                    $sum: "$spaceReviews.rating",
                  },
                  "$reviewCount",
                ],
              },
              else: 0,
            },
          },
        })
        .lookup({
          from: `${ImageMeta.name.toLowerCase()}s`,
          let: {
            spaceImagesIds: {
              $map: {
                input: "$spaceImages",
                as: "spaceImage",
                in: {
                  $toObjectId: "$$spaceImage",
                },
              },
            },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$_id", "$$spaceImagesIds"],
                },
              },
            },
            {
              $project: {
                _id: 0,
                url: 1,
                name: 1,
              },
            },
            {
              $limit: 1,
            },
          ],
          as: "coverImage",
        })
        .addFields({
          coverImage: {
            $arrayElemAt: ["$coverImage.url", 0],
          },
        })
        .lookup({
          from: `${SpaceAccessOptionModel.name.toLowerCase()}s`,
          let: {
            accessMethodId: "$accessMethod",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [
                    { $toString: "$_id" },
                    { $toString: "$$accessMethodId" },
                  ],
                },
              },
            },
          ],
          as: "accessMethod",
        })
        .addFields({
          accessMethod: {
            $arrayElemAt: ["$accessMethod.name", 0],
          },
        })
        .project({
          _id: 1,
          name: 1,
          location: 1,
          price: 1,
          minimumPeriod: 1,
          reviewCount: 1,
          averageRating: 1,
          coverImage: 1,
          accessMethod: 1,
        })
        .exec();

      return new PaginatedResponseDto(totalRecords, Page, PageSize, result);
    } catch (error) {
      this._logger.error("Error finding all document:", error);
      throw new BadRequestException("Could not get all document");
    }
  }

  async findOne(id: string): Promise<SuccessResponseDto> {
    const result = await this._spaceForRentModel
      .findById(id)
      .populate([
        {
          path: "createdBy",
          model: UserModel.name,
          select: "id email fullName",
        },
        {
          path: "updatedBy",
          model: UserModel.name,
          select: "id email fullName",
        },
        {
          path: "type",
          model: SpaceTypeModel.name,
          select: "id name",
        },
        {
          path: "accessMethod",
          model: SpaceAccessOptionModel.name,
          select: "id name",
        },
        {
          path: "storageConditions",
          model: StorageConditionFeature.name,
          select: "id name",
        },
        {
          path: "unloadingMovings",
          model: UnloadingMovingFeature.name,
          select: "id name",
        },
        {
          path: "spaceSecurities",
          model: SpaceSecurityFeature.name,
          select: "id name",
        },
        {
          path: "spaceSchedules",
          model: SpaceScheduleFeature.name,
          select: "id name",
        },
        {
          path: "spaceImages",
          model: ImageMeta.name,
          select: "id url name extension size mimeType",
        },
      ])
      .exec();

    if (!result) {
      this._logger.error(`Document not found with ID: ${id}`);
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
      if (updateSpaceDto.type) {
        await this._spaceTypeService.validateObjectId(updateSpaceDto.type);
      }
      if (updateSpaceDto.accessMethod) {
        await this._spaceAccessOptionService.validateObjectId(
          updateSpaceDto.accessMethod,
        );
      }
      if (updateSpaceDto.storageConditions?.length) {
        await this._storageConditionService.validateObjectIds(
          updateSpaceDto.storageConditions,
        );
      }
      if (updateSpaceDto.unloadingMovings?.length) {
        await this._unloadingMovingService.validateObjectIds(
          updateSpaceDto.unloadingMovings,
        );
      }
      if (updateSpaceDto.spaceSecurities?.length) {
        await this._spaceSecurityService.validateObjectIds(
          updateSpaceDto.spaceSecurities,
        );
      }
      if (updateSpaceDto.spaceSchedules?.length) {
        await this._spaceScheduleService.validateObjectIds(
          updateSpaceDto.spaceSchedules,
        );
      }

      // update document
      const updatedItem = await this._spaceForRentModel
        .findByIdAndUpdate(
          id,
          {
            ...updateSpaceDto,
            updatedBy: userId,
            updatedAt: new Date(),
          },
          { new: true },
        )
        .exec();

      if (!updatedItem) {
        this._logger.error(`Document not found with ID: ${id}`);
        throw new NotFoundException(`Could not find space type with ID: ${id}`);
      }

      return new SuccessResponseDto(
        "Document updated successfully",
        updatedItem,
      );
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      if (error.name === "MongoError" && error.code === 11000) {
        this._logger.error("Duplicate key error:", error);
        throw new ConflictException("Document already exists");
      }

      this._logger.error("Error updating document:", error);
      throw new BadRequestException("Error updating document");
    }
  }

  async verify(
    spaceId: string,
    isVerified: boolean,
    auditUserId: string,
  ): Promise<SuccessResponseDto> {
    try {
      const result = await this._spaceForRentModel
        .findByIdAndUpdate(
          spaceId,
          {
            isVerifiedByAdmin: isVerified,
            updatedBy: auditUserId,
            updatedAt: new Date(),
          },
          { new: true },
        )
        .exec();

      if (!result) {
        this._logger.error(`Document not found with ID: ${spaceId}`);
        throw new NotFoundException(
          `Could not find space type with ID: ${spaceId}`,
        );
      }

      return new SuccessResponseDto("Document updated successfully", result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this._logger.error("Error updating document:", error);
      throw new BadRequestException("Error updating document");
    }
  }

  async remove(id: string): Promise<SuccessResponseDto> {
    const result = await this._spaceForRentModel.findByIdAndDelete(id).exec();

    if (!result) {
      this._logger.error(`Document not deleted with ID: ${id}`);
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
      const existingSpace = await this._spaceForRentModel.findById(id).exec();

      if (!existingSpace) {
        this._logger.error(`Document not found with ID: ${id}`);
        throw new NotFoundException(`Could not find space type with ID: ${id}`);
      }

      const createdImages = await this._imageService.createMultipleImages(
        addSpaceImageDto.spaceImages,
        existingSpace.id,
      );
      const spaceImagesIDs = createdImages.map((image) => image.id);

      const result = await this._spaceForRentModel
        .findByIdAndUpdate(
          id,
          {
            spaceImages: spaceImagesIDs,
            updatedBy: userId,
            updatedAt: new Date(),
          },
          { new: true },
        )
        .exec();

      if (!result) {
        this._logger.error(`Document not found with ID: ${id}`);
        throw new NotFoundException(`Could not find space type with ID: ${id}`);
      }

      return new SuccessResponseDto("Document updated successfully", result);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      if (error.name === "MongoError" && error.code === 11000) {
        this._logger.error("Duplicate key error:", error);
        throw new ConflictException("Document already exists");
      }

      this._logger.error("Error updating document:", error);
      throw new BadRequestException("Error updating document");
    }
  }

  async removeSpaceImage(
    imageId: string,
    spaceForRentId: string,
  ): Promise<SuccessResponseDto> {
    const existingSpaceForRent = await this._spaceForRentModel
      .findById(spaceForRentId)
      .exec();

    if (!existingSpaceForRent) {
      throw new NotFoundException(
        `Could not find space for rent with ID: ${spaceForRentId}`,
      );
    }

    const result = await this._imageService.removeImage(
      imageId,
      spaceForRentId,
    );

    if (!result) {
      this._logger.error(`Image not deleted with ID: ${imageId}`);
      throw new BadRequestException(
        `Could not delete image with ID: ${imageId}`,
      );
    }

    return new SuccessResponseDto("Image deleted successfully");
  }

  //#region InternalMethods
  async validateObjectId(id: string): Promise<void> {
    const result = await this._spaceForRentModel
      .findById(id)
      .select("_id")
      .exec();

    if (!result) {
      this._logger.error(`Invalid space ID: ${id}`);
      throw new BadRequestException("Invalid space ID");
    }
  }
  //#endregion
}
