import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { ConfigurationRepository } from "./configuration.repository";
import {
  CommissionSettingsDto,
  UpdateCommissionSettingsDto,
} from "./dto/commission-settings.dto";
import {
  Configuration,
  ConfigurationDocument,
} from "./entities/configuration.entity";

@Injectable()
export class ConfigurationService {
  private readonly _logger: Logger = new Logger(ConfigurationService.name);

  constructor(
    private readonly _configurationRepository: ConfigurationRepository,
  ) {}

  async updateCommissionSettings(
    configurationDto: UpdateCommissionSettingsDto,
    userId: string,
  ) {
    try {
      const result = await this._upsertConfiguration(configurationDto, userId);

      if (!result) {
        this._logger.error("Failed to update commission configuration");
        throw new BadRequestException(
          "Failed to update commission configuration",
        );
      }

      const commissionDto = new CommissionSettingsDto();
      commissionDto.ownerCommission = result?.ownerCommission ?? 0;
      commissionDto.renterCommission = result?.renterCommission ?? 0;

      return new SuccessResponseDto(
        "Document updated successfully",
        commissionDto,
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      this._logger.error("Error updating document:", error);
      throw new BadRequestException("Error updating document");
    }
  }

  async getCommissionSettings() {
    try {
      const latestConfig = await this._getLatestConfiguration();

      const commissionDto = new CommissionSettingsDto();
      commissionDto.ownerCommission = latestConfig?.ownerCommission ?? 0;
      commissionDto.renterCommission = latestConfig?.renterCommission ?? 0;

      return new SuccessResponseDto(
        "Commission settings retrieved successfully",
        commissionDto,
      );
    } catch (error) {
      this._logger.error("Error in getCommissionSettings:", error);
      throw new BadRequestException("Error getting document");
    }
  }

  // Private helpers
  private async _getLatestConfiguration(): Promise<ConfigurationDocument | null> {
    return await this._configurationRepository.findOneWhere(
      {},
      {
        sort: { updatedAt: -1, createdAt: -1 },
      },
    );
  }

  private async _upsertConfiguration(
    configuration: Partial<Configuration>,
    auditUserId: string,
  ): Promise<ConfigurationDocument> {
    const latestConfig = await this._getLatestConfiguration();

    if (latestConfig) {
      configuration.updatedBy = auditUserId;
      configuration.updatedAt = new Date();
      return await this._configurationRepository.updateOneById(
        latestConfig.id,
        configuration,
      );
    } else {
      configuration.createdBy = auditUserId;
      configuration.updatedBy = auditUserId;
      return await this._configurationRepository.create(configuration);
    }
  }
}
