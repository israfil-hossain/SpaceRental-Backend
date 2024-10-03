/* eslint-disable prettier/prettier */
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { GenericRepository } from "../common/repository/generic-repository";
import {
  SpaceBooking,
  SpaceBookingDocument,
  SpaceBookingType,
} from "./entities/space-booking.entity";
import { FilterQuery } from "mongoose";
import { SpaceForRent } from "../space-for-rent/entities/space-for-rent.entity";
import { PaymentReceive } from "../payment-receive/entities/payment-receive.entity";
import { SpaceReview } from "../space-review/entities/space-review.entity";
import { ImageMeta } from "../image-meta/entities/image-meta.entity";
import { ApplicationUser } from "../application-user/entities/application-user.entity";
import { SpaceAccessMethod } from "../space-access-method/entities/space-access-method.entity";

@Injectable()
export class SpaceBookingRepository extends GenericRepository<SpaceBookingDocument> {
  private readonly logger: Logger;
  constructor(
    @InjectModel(SpaceBooking.name)
    private model: SpaceBookingType,
  ) {
    super(model, new Logger(SpaceBookingRepository.name));
  }

  async findAllBookings(
    filter: FilterQuery<SpaceBookingDocument>,
    skip: number,
    limit: number,
  ): Promise<SpaceBookingDocument[]> {
    try {
      const result = await this.model
        .aggregate()
        .sort({ createdAt: -1 })
        .match(filter)
        .skip(skip)
        .limit(limit)
        .lookup({
          from: `${SpaceForRent.name.toLowerCase()}s`,
          let: {
            spaceId: "$space",
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: [{ $toString: "$_id" }, { $toString: "$$spaceId" }],
                },
              },
            },
            {
              $lookup: {
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
              },
            },
            {
              $addFields: {
                accessMethod: {
                  $cond: {
                    if: { $eq: [{ $size: "$accessMethod" }, 0] },
                    then: null,
                    else: { $arrayElemAt: ["$accessMethod.name", 0] },
                  },
                },
              },
            },
            {
              $lookup: {
                from: `${ImageMeta.name.toLowerCase()}s`,
                let: {
                  createdBy: "$createdBy",
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $eq: [
                          { $toString: "$ownerId" },
                          { $toString: "$$createdBy" },
                        ],
                      },
                    },
                  },
                ],
                as: "createdByUserProfilePicture",
              },
            },
            {
              $addFields: {
                ownerProfilePicture: {
                  $cond: {
                    if: { $eq: [{ $size: "$createdByUserProfilePicture" }, 0] },
                    then: null,
                    else: {
                      $arrayElemAt: ["$createdByUserProfilePicture.url", 0],
                    },
                  },
                },
              },
            },
            {
              $lookup: {
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
              },
            },
            {
              $addFields: {
                reviewCount: { $size: "$spaceReviews" },
              },
            },
            {
              $addFields: {
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
              },
            },
            {
              $lookup: {
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
                    },
                  },
                  {
                    $limit: 1,
                  },
                ],
                as: "coverImage",
              },
            },
            {
              $addFields: {
                coverImage: {
                  $cond: {
                    if: { $eq: [{ $size: "$coverImage" }, 0] },
                    then: null,
                    else: { $arrayElemAt: ["$coverImage.url", 0] },
                  },
                },
              },
            },
            {
              $lookup: {
                from: `${ApplicationUser.name.toLowerCase()}s`,
                let: {
                  favoriteIds: {
                    $map: {
                      input: "$favorites",
                      as: "fav",
                      in: { $toObjectId: "$$fav" },
                    },
                  },
                },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $in: [
                          "$_id",
                          {
                            $cond: {
                              if: { $isArray: "$$favoriteIds" },
                              then: "$$favoriteIds",
                              else: [],
                            },
                          },
                        ],
                      },
                    },
                  },
                  {
                    $lookup: {
                      from: `${ImageMeta.name.toLowerCase()}s`,
                      let: {
                        favoriteBy: "$_id",
                      },
                      pipeline: [
                        {
                          $match: {
                            $expr: {
                              $eq: [
                                { $toString: "$ownerId" },
                                { $toString: "$$favoriteBy" },
                              ],
                            },
                          },
                        },
                      ],
                      as: "profilePicture",
                    },
                  },
                  {
                    $addFields: {
                      profilePicture: {
                        $arrayElemAt: ["$profilePicture.url", 0],
                      },
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      fullName: 1,
                      profilePicture: 1,
                    },
                  },
                ],
                as: "favoriteUsers",
              },
            },
            {
              $project: {
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
                favoriteUsers: 1,
              },
            },
          ],
          as: "spaceDetails",
        })
        .addFields({
          spaceDetails: { $arrayElemAt: ["$spaceDetails", 0] },
        })
        .addFields({
          durationInDays: {
            $divide: [
              { $subtract: ["$toDate", "$fromDate"] },
              1000 * 60 * 60 * 24,
            ],
          },
        })
        .project({
          _id: 1,
          totalPrice: 1,
          platformFee: 1,
          bookingPrice: 1,
          bookingCode: 1,
          bookingStatus: 1,
          fromDate: 1,
          toDate: 1,
          spaceDetails: 1,
        })
        .exec();

      return result;
    } catch (error) {
      this.logger.error("Error finding entities:", error);
      return [];
    }
  }
}

