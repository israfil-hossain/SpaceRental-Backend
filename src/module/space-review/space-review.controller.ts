import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthUserId } from "../auth/decorator/auth-user-id.decorator";
import { DocIdQueryDto } from "../common/dto/doc-id-query.dto";
import { PaginatedResponseDto } from "../common/dto/paginated-response.dto";
import { SuccessResponseDto } from "../common/dto/success-response.dto";
import { RequiredRoles } from "../user/decorator/roles.decorator";
import { UserRoleEnum } from "../user/enum/user-role.enum";
import { CreateSpaceReviewDto } from "./dto/create-space-review.dto";
import { ListSpaceReviewQuery } from "./dto/list-space-review-query.dto";
import { SpaceReviewService } from "./space-review.service";

@ApiTags("Space Reviews")
@Controller("SpaceReview")
export class SpaceReviewController {
  constructor(private readonly spaceReviewService: SpaceReviewService) {}

  @Post("Create")
  @ApiBody({ type: CreateSpaceReviewDto })
  @ApiResponse({
    status: 201,
    type: SuccessResponseDto,
  })
  create(
    @AuthUserId() { userId }: ITokenPayload,
    @Body() createSpaceReviewDto: CreateSpaceReviewDto,
  ) {
    return this.spaceReviewService.create(createSpaceReviewDto, userId);
  }

  @Get("GetAll")
  @ApiResponse({
    status: 200,
    type: PaginatedResponseDto,
  })
  @RequiredRoles([UserRoleEnum.SUPER_ADMIN, UserRoleEnum.ADMIN])
  findAll(@Query() listSpaceReviewQuery: ListSpaceReviewQuery) {
    return this.spaceReviewService.findAll(listSpaceReviewQuery);
  }

  @Get("GetAllBySpaceId/:DocId")
  findAllBySpaceId(@Param() { DocId }: DocIdQueryDto) {
    return this.spaceReviewService.findAllBySpaceId(DocId);
  }

  @Delete("DeleteById/:DocId")
  remove(@Param() { DocId }: DocIdQueryDto) {
    return this.spaceReviewService.remove(DocId);
  }
}
