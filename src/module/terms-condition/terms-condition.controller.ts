import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { RequiredRoles } from "../application-user/decorator/roles.decorator";
import { ApplicationUserRoleEnum } from "../application-user/enum/application-user-role.enum";
import { AuthUserId } from "../auth/decorator/auth-user-id.decorator";
import { DocIdQueryDto } from "../common/dto/doc-id-query.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateTermsConditionDto } from "./dto/create-terms-condition.dto";
import { UpdateTermsConditionDto } from "./dto/update-terms-condition.dto";
import { TermsConditionService } from "./terms-condition.service";

@ApiTags("Terms and Conditions")
@Controller("terms-condition")
export class TermsConditionController {
  constructor(private readonly _termsConditionService: TermsConditionService) {}

  @Post("Create")
  @ApiBody({ type: CreateTermsConditionDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  @RequiredRoles([
    ApplicationUserRoleEnum.SUPER_ADMIN,
    ApplicationUserRoleEnum.ADMIN,
  ])
  create(
    @AuthUserId() { userId }: ITokenPayload,
    @Body() createSpaceDto: CreateTermsConditionDto,
  ) {
    return this._termsConditionService.create(createSpaceDto, userId);
  }

  @Get("GetAll")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  findAll() {
    return this._termsConditionService.findAll();
  }

  @Patch("UpdateById/:DocId")
  @ApiBody({ type: UpdateTermsConditionDto })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  @RequiredRoles([
    ApplicationUserRoleEnum.SUPER_ADMIN,
    ApplicationUserRoleEnum.ADMIN,
  ])
  update(
    @Param() { DocId }: DocIdQueryDto,
    @AuthUserId() { userId }: ITokenPayload,
    @Body() updateTermsConditionDto: UpdateTermsConditionDto,
  ) {
    return this._termsConditionService.update(
      DocId,
      updateTermsConditionDto,
      userId,
    );
  }

  @Delete("DeleteById/:DocId")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  @RequiredRoles([
    ApplicationUserRoleEnum.SUPER_ADMIN,
    ApplicationUserRoleEnum.ADMIN,
  ])
  remove(@Param() { DocId }: DocIdQueryDto) {
    return this._termsConditionService.remove(DocId);
  }
}
