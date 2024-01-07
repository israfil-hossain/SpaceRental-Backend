import { ApiProperty } from "@nestjs/swagger";

export class UpdateProfilePictureDto {
  @ApiProperty({
    required: true,
    description: "Profile picture",
    type: "file",
  })
  profilePicture: Express.Multer.File;
}
