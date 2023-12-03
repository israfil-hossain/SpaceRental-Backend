import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class ChangePasswordDto {
  @IsNotEmpty({ message: "Old password is required" })
  @IsString({ message: "Old password must be a string" })
  oldPassword: string;

  @IsNotEmpty({ message: "New password should not be empty" })
  @MinLength(8, { message: "New password must be at least 8 characters long" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]*$/, {
    message:
      "New password must contain at least one uppercase letter, one lowercase letter, and one number",
  })
  newPassword: string;
}
