import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CommissionSettingsDto } from "./dto/commission-settings.dto";
import {
  Configuration,
  ConfigurationType,
} from "./entities/configuration.entity";

@Injectable()
export class ConfigurationService {
  private readonly _logger: Logger = new Logger(ConfigurationService.name);

  constructor(
    @InjectModel(Configuration.name)
    private _configurationModel: ConfigurationType,
  ) {}

  async updateCommissionSettings(
    configurationDto: CommissionSettingsDto,
    userId: string,
  ) {
    try {
      const existingConfig = await this._configurationModel.findOne().exec();

      const updateQuery = existingConfig
        ? this._configurationModel
            .findOneAndUpdate(
              {},
              { ...configurationDto, updatedAt: new Date(), updatedBy: userId },
              { new: true },
            )
            .exec()
        : new this._configurationModel({
            ...configurationDto,
            createdBy: userId,
          }).save();

      const result = await updateQuery;

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
      const latestConfig = await this._configurationModel
        .findOne()
        .sort({ updatedAt: -1, createdAt: -1 })
        .exec();

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
}
