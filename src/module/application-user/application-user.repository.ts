/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { GenericRepository } from "../common/repository/generic-repository";
import {
  ApplicationUser,
  ApplicationUserDocument,
  ApplicationUserType,
} from "./entities/application-user.entity";

@Injectable()
export class ApplicationUserRepository extends GenericRepository<ApplicationUserDocument> {
  private readonly logger: Logger;
  constructor(
    @InjectModel(ApplicationUser.name)
    private model: ApplicationUserType,
  ) {
    const logger = new Logger(ApplicationUserRepository.name);
    super(model, logger);
    this.logger = logger;
  }

  async getAnalytics() {
    try {
      // const result = await this.model.aggregate([
      //   { $group: { _id: "$role", count: { $sum: 1 } } },
      // ]);

      const result = await this.model
        .aggregate([
          {
            $lookup: {
              from: `${ApplicationUser.name}s`,
              localField: "_id",
              foreignField: "userId",
              as: "users",
            },
          },
          {
            $group: {
              _id: "$role",
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              _id: 0,
              role: "$_id",
              count: 1,
            },
          },
          {
            $group: {
              _id: null,
              userCount: {
                $push: { k: "$role", v: "$count" },
              },
            },
          },
          {
            $addFields: {
              userCount: {
                $arrayToObject: "$userCount",
              },
            },
          },
          {
            $project: {
              _id: 0,
            },
          },
        ])
        .exec();

      console.log(result);

      return result;
    } catch (error) {
      this.logger.error("Error getting analytics:", error);
      throw new BadRequestException("Could not get analytics");
    }
  }
}

