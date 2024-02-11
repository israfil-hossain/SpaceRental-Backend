import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { FilterQuery } from "mongoose";
import { GenericRepository } from "../common/repository/generic-repository";
import { ImageMeta } from "../image-meta/entities/image-meta.entity";
import { SpaceAccessMethod } from "../space-access-method/entities/space-access-method.entity";
import { SpaceReview } from "../space-review/entities/space-review.entity";
import {
  SpaceForRent,
  SpaceForRentDocument,
  SpaceForRentType,
} from "./entities/space-for-rent.entity";

@Injectable()
export class SpaceForRentRepository extends GenericRepository<SpaceForRentDocument> {
  private readonly logger: Logger;

  constructor(
    @InjectModel(SpaceForRent.name)
    private model: SpaceForRentType,
  ) {
    const logger = new Logger(SpaceForRentRepository.name);
    super(model, logger);
    this.logger = logger;
  }

  async findForCardView(
    filter: FilterQuery<SpaceForRentDocument>,
    skip: number,
    limit: number,
  ): Promise<SpaceForRentDocument[]> {
    try {
      const result = await this.model
        .aggregate()
        .sort({ createdAt: -1 })
        .match(filter)
        .skip(skip)
        .limit(limit)
        .lookup({
          from: `${SpaceReview.name.toLowerCase()}s`,
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
            $cond: {
              if: { $eq: [{ $size: "$coverImage" }, 0] },
              then: null,
              else: { $arrayElemAt: ["$coverImage.url", 0] },
            },
          },
        })
        .lookup({
          from: `${SpaceAccessMethod.name.toLowerCase()}s`,
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
            $cond: {
              if: { $eq: [{ $size: "$accessMethod" }, 0] },
              then: null,
              else: { $arrayElemAt: ["$accessMethod.name", 0] },
            },
          },
        })
        .lookup({
          from: `${ImageMeta.name.toLowerCase()}s`,
          let: {
            createdByUserId: "$createdBy",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [
                    { $toString: "$ownerId" },
                    { $toString: "$$createdByUserId" },
                  ],
                },
              },
            },
          ],
          as: "createdByUserProfilePicture",
        })
        .addFields({
          ownerProfilePicture: {
            $cond: {
              if: { $eq: [{ $size: "$createdByUserProfilePicture" }, 0] },
              then: null,
              else: { $arrayElemAt: ["$createdByUserProfilePicture.url", 0] },
            },
          },
        })
        .project({
          _id: 1,
          name: 1,
          location: 1,
          pricePerMonth: 1,
          minimumBookingDays: 1,
          reviewCount: 1,
          averageRating: 1,
          coverImage: 1,
          accessMethod: 1,
          ownerProfilePicture: 1,
        })
        .exec();

      return result;
    } catch (error) {
      this.logger.error("Error finding entities:", error);
      return [];
    }
  }

  async findOnePopulatedById(id: string): Promise<SpaceForRentDocument | null> {
    try {
      const result = await this.model
        .findOne({ _id: id }, null, {
          populate: [
            {
              path: "createdBy",
              select: "-_id email fullName",
            },
            {
              path: "updatedBy",
              select: "-_id email fullName",
            },
            {
              path: "verifiedBy",
              select: "-_id email fullName profilePicture",
              populate: [
                {
                  path: "profilePicture",
                  select: "url",
                  transform: (doc) => doc?.url,
                },
              ],
            },
            {
              path: "type",
              select: "name",
            },
            {
              path: "accessMethod",
              select: "name",
            },
            {
              path: "storageConditions",
              select: "name",
            },
            {
              path: "unloadingMovings",
              select: "name",
            },
            {
              path: "spaceSecurities",
              select: "name",
            },
            {
              path: "spaceSchedules",
              select: "name",
            },
            {
              path: "spaceImages",
              select: "url name extension size",
            },
          ],
        })
        .exec();
      return result;
    } catch (error) {
      this.logger.error("Error finding entity by ID:", error);
      return null;
    }
  }
}
