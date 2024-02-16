import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { SpaceAccessMethodRepository } from "../space-access-method/space-access-method.repository";
import { SpaceScheduleRepository } from "../space-schedule/space-schedule.repository";
import { SpaceSecurityRepository } from "../space-security/space-security.repository";
import { SpaceTypeRepository } from "../space-type/space-type.repository";
import { StorageConditionRepository } from "../storage-condition/storage-condition.repository";
import { UnloadingMovingRepository } from "../unloading-moving/unloading-moving.repository";
import { CreateSpaceForRentDto } from "./dto/create-space-for-rent.dto";
import { UpdateSpaceForRentDto } from "./dto/update-space-for-rent.dto";

@Injectable()
export class SpaceForRentValidator {
  private readonly logger: Logger = new Logger(SpaceForRentValidator.name);

  constructor(
    private spaceType: SpaceTypeRepository,
    private spaceAccessMethod: SpaceAccessMethodRepository,
    private storageCondition: StorageConditionRepository,
    private unloadingMoving: UnloadingMovingRepository,
    private spaceSecurity: SpaceSecurityRepository,
    private spaceSchedule: SpaceScheduleRepository,
  ) {}

  //#region InternalMethods
  async validateSpaceRelatedIDs(
    spaceDTO: CreateSpaceForRentDto | UpdateSpaceForRentDto,
  ) {
    // validate space type
    if (
      !!spaceDTO?.type &&
      !(await this.spaceType.validateObjectIds([spaceDTO.type]))
    ) {
      this.logger.error(`Space type ${spaceDTO.type} is not valid`);
      throw new BadRequestException(`Space type ${spaceDTO.type} is not valid`);
    }

    // validate space access method
    if (
      !!spaceDTO?.accessMethod &&
      !(await this.spaceAccessMethod.validateObjectIds([spaceDTO.accessMethod]))
    ) {
      this.logger.error(
        `Space access method ${spaceDTO.accessMethod} is not valid`,
      );
      throw new BadRequestException(
        `Space access method ${spaceDTO.accessMethod} is not valid`,
      );
    }

    // validate storage conditions
    if (
      !!spaceDTO?.storageConditions?.length &&
      !(await this.storageCondition.validateObjectIds(
        spaceDTO.storageConditions,
      ))
    ) {
      const objectIdsString = spaceDTO.storageConditions.join(", ");
      this.logger.error(`Storage conditions ${objectIdsString} are not valid`);
      throw new BadRequestException(
        `Storage conditions ${objectIdsString} are not valid`,
      );
    }

    // validate unloading moving
    if (
      !!spaceDTO?.unloadingMovings?.length &&
      !(await this.unloadingMoving.validateObjectIds(spaceDTO.unloadingMovings))
    ) {
      const objectIdsString = spaceDTO.unloadingMovings.join(", ");
      this.logger.error(`Unloading moving ${objectIdsString} are not valid`);
      throw new BadRequestException(
        `Unloading moving ${objectIdsString} are not valid`,
      );
    }

    // validate space security
    if (
      !!spaceDTO?.spaceSecurities?.length &&
      !(await this.spaceSecurity.validateObjectIds(spaceDTO.spaceSecurities))
    ) {
      const objectIdsString = spaceDTO.spaceSecurities.join(", ");
      this.logger.error(`Space security ${objectIdsString} are not valid`);
      throw new BadRequestException(
        `Space security ${objectIdsString} are not valid`,
      );
    }

    // validate space schedule
    if (
      !!spaceDTO?.spaceSchedules?.length &&
      !(await this.spaceSchedule.validateObjectIds(spaceDTO.spaceSchedules))
    ) {
      const objectIdsString = spaceDTO.spaceSchedules.join(", ");
      this.logger.error(`Space schedule ${objectIdsString} are not valid`);
      throw new BadRequestException(
        `Space schedule ${objectIdsString} are not valid`,
      );
    }

    return spaceDTO;
  }
  //#endregion
}
