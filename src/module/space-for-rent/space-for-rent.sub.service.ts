import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
  SpaceAccessType,
  SpaceAccessTypeType,
} from "../space-access-type/entities/space-access-type.entity";
import {
  SpaceSchedule,
  SpaceScheduleType,
} from "../space-schedule/entities/space-schedule.entity";
import {
  SpaceSecurity,
  SpaceSecurityType,
} from "../space-security/entities/space-security.entity";
import {
  SpaceType,
  SpaceTypeType,
} from "../space-type/entities/space-type.entity";
import {
  StorageCondition,
  StorageConditionType,
} from "../storage-condition/entities/storage-condition.entity";
import {
  UnloadingMoving,
  UnloadingMovingType,
} from "../unloading-moving/entities/unloading-moving.entity";

@Injectable()
export class SpaceForRentSubService {
  private readonly _logger: Logger = new Logger(SpaceForRentSubService.name);

  constructor(
    @InjectModel(SpaceType.name)
    private _spaceType: SpaceTypeType,
    @InjectModel(SpaceAccessType.name)
    private _spaceAccessType: SpaceAccessTypeType,
    @InjectModel(StorageCondition.name)
    private _storageCondition: StorageConditionType,
    @InjectModel(UnloadingMoving.name)
    private _unloadingMoving: UnloadingMovingType,
    @InjectModel(SpaceSecurity.name)
    private _spaceSecurity: SpaceSecurityType,
    @InjectModel(SpaceSchedule.name)
    private _spaceSchedule: SpaceScheduleType,
  ) {}

  //#region InternalMethods
  public async validateSpaceTypeObjectId(id: string): Promise<void> {
    const result = await this._spaceType.findById(id).select("_id").exec();

    if (!result) {
      this._logger.error(`Invalid space type ID: ${id}`);
      throw new BadRequestException("Invalid space type ID");
    }
  }

  public async validateSpaceAccessTypeObjectId(id: string): Promise<void> {
    const result = await this._spaceAccessType
      .findById(id)
      .select("_id")
      .exec();

    if (!result) {
      this._logger.error(`Invalid space access option ID: ${id}`);
      throw new BadRequestException("Invalid space access option ID");
    }
  }

  public async validateStorageConditionObjectIds(
    listOfIds: string[] = [],
  ): Promise<void> {
    const result = await this._storageCondition
      .find({ _id: { $in: listOfIds } })
      .select("_id")
      .exec();

    if (listOfIds.length !== result.length) {
      this._logger.error(`Invalid space security IDs: ${listOfIds}`);
      throw new BadRequestException("Invalid space security IDs");
    }
  }
  public async validateUnloadingMovingObjectIds(
    listOfIds: string[] = [],
  ): Promise<void> {
    const result = await this._unloadingMoving
      .find({ _id: { $in: listOfIds } })
      .select("_id")
      .exec();

    if (listOfIds.length !== result.length) {
      this._logger.error(`Invalid space security IDs: ${listOfIds}`);
      throw new BadRequestException("Invalid space security IDs");
    }
  }

  public async validateSpaceSecurityObjectIds(
    listOfIds: string[] = [],
  ): Promise<void> {
    const result = await this._spaceSecurity
      .find({ _id: { $in: listOfIds } })
      .select("_id")
      .exec();

    if (listOfIds.length !== result.length) {
      this._logger.error(`Invalid space security IDs: ${listOfIds}`);
      throw new BadRequestException("Invalid space security IDs");
    }
  }

  public async validateSpaceScheduleObjectIds(
    listOfIds: string[] = [],
  ): Promise<void> {
    const result = await this._spaceSchedule
      .find({ _id: { $in: listOfIds } })
      .select("_id")
      .exec();

    if (listOfIds.length !== result.length) {
      this._logger.error(`Invalid space schedule IDs: ${listOfIds}`);
      throw new BadRequestException("Invalid space schedule IDs");
    }
  }
  //#endregion
}
