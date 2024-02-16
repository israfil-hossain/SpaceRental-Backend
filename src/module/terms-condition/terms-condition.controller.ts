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
import { AuthUserId } from "../authentication/decorator/auth-user-id.decorator";
import { DocIdQueryDto } from "../common/dto/doc-id-query.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { CreateTermsConditionDto } from "./dto/create-terms-condition.dto";
import { UpdateTermsConditionDto } from "./dto/update-terms-condition.dto";
import { TermsConditionService } from "./terms-condition.service";

@ApiTags("Terms and Conditions")
@Controller("TermsAndCondition")
export class TermsConditionController {
  constructor(private readonly termsConditionService: TermsConditionService) {}

  @Post("Create")
  @ApiBody({ type: CreateTermsConditionDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  @RequiredRoles([ApplicationUserRoleEnum.ADMIN])
  create(
    @AuthUserId() { userId }: ITokenPayload,
    @Body() createSpaceDto: CreateTermsConditionDto,
  ) {
    return this.termsConditionService.create(createSpaceDto, userId);
  }

  @Get("GetAll")
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  findAll() {
    return this.termsConditionService.findAll();
  }

  @Patch("UpdateById/:DocId")
  @ApiBody({ type: UpdateTermsConditionDto })
  @ApiResponse({
    status: 200,
    type: SuccessResponseDto,
  })
  @RequiredRoles([ApplicationUserRoleEnum.ADMIN])
  update(
    @Param() { DocId }: DocIdQueryDto,
    @AuthUserId() { userId }: ITokenPayload,
    @Body() updateTermsConditionDto: UpdateTermsConditionDto,
  ) {
    return this.termsConditionService.update(
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
  @RequiredRoles([ApplicationUserRoleEnum.ADMIN])
  remove(@Param() { DocId }: DocIdQueryDto) {
    return this.termsConditionService.remove(DocId);
  }
}
