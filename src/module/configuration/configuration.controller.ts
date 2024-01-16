import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { RequiredRoles } from "../application-user/decorator/roles.decorator";
import { ApplicationUserRoleEnum } from "../application-user/enum/application-user-role.enum";
import { AuthUserId } from "../auth/decorator/auth-user-id.decorator";
import { ConfigurationService } from "./configuration.service";
import { CommissionSettingsDto } from "./dto/commission-settings.dto";

@ApiTags("Configurations")
@Controller("Configuration")
export class ConfigurationController {
  constructor(private readonly _configurationService: ConfigurationService) {}

  @Post("SetCommissionSettings")
  @RequiredRoles([ApplicationUserRoleEnum.SUPER_ADMIN])
  updateCommission(
    @AuthUserId() { userId }: ITokenPayload,
    @Body() updateCommissionSettingsDto: CommissionSettingsDto,
  ) {
    return this._configurationService.updateCommissionSettings(
      updateCommissionSettingsDto,
      userId,
    );
  }

  @Get("GetCommissionSettings")
  @RequiredRoles([ApplicationUserRoleEnum.SUPER_ADMIN])
  getCommission() {
    return this._configurationService.getCommissionSettings();
  }
}
