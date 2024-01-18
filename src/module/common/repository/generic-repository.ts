import { ConflictException, Logger, NotFoundException } from "@nestjs/common";
import {
  Document,
  FilterQuery,
  Model,
  QueryOptions,
  SaveOptions,
  UpdateQuery,
  UpdateWithAggregationPipeline,
} from "mongoose";

export class GenericRepository<T extends Document> {
  public readonly _logger: Logger;
  private readonly _model: Model<T>;

  constructor(model: Model<T>, logger?: Logger) {
    this._model = model;
    this._logger = logger || new Logger(this.constructor.name);
  }

  async create(doc: Partial<T>, saveOptions?: SaveOptions): Promise<T> {
    try {
      const createdEntity = new this._model(doc);
      const savedResult = await createdEntity.save(saveOptions);

      return savedResult;
    } catch (error) {
      if (error?.name === "MongoServerError" && error?.code === 11000) {
        this._logger.error("Duplicate key error:", error);
        throw new ConflictException(
          "Document already exists with provided inputs",
          {
            cause: "RepositoryException",
          },
        );
      }

      throw error;
    }
  }

  async find(filter: FilterQuery<T>, options?: QueryOptions): Promise<T[]> {
    try {
      const result = await this._model.find(filter, null, options).exec();
      return result;
    } catch (error) {
      this._logger.error("Error finding entities:", error);
      return [];
    }
  }

  async findById(id: string, options?: QueryOptions): Promise<T | null> {
    try {
      const result = await this._model
        .findOne({ _id: id }, null, options)
        .exec();
      return result;
    } catch (error) {
      this._logger.error("Error finding entity by ID:", error);
      return null;
    }
  }

  async findAll(): Promise<T[]> {
    try {
      const result = await this._model.find().exec();
      return result;
    } catch (error) {
      this._logger.error("Error finding all entities:", error);
      return [];
    }
  }

  async updateOneById(
    id: string,
    updated: UpdateWithAggregationPipeline | UpdateQuery<T>,
    options?: QueryOptions,
  ): Promise<T> {
    try {
      const result = await this._model
        .findOneAndUpdate({ _id: id }, updated, options)
        .exec();

      if (!result) {
        throw new NotFoundException("Document not found with provided ID", {
          cause: "RepositoryException",
        });
      }

      return result;
    } catch (error) {
      this._logger.error("Error updating one entity:", error);
      throw error;
    }
  }

  async removeOneById(id: string): Promise<boolean> {
    try {
      const { acknowledged } = await this._model.deleteOne({ _id: id }).exec();
      return acknowledged;
    } catch (error) {
      this._logger.error("Error removing entities:", error);
      throw error;
    }
  }

  async count(filter: FilterQuery<T>): Promise<number> {
    try {
      const count = await this._model.countDocuments(filter).exec();
      return count;
    } catch (error) {
      console.error("Error counting documents:", error);
      throw error;
    }
  }
}
