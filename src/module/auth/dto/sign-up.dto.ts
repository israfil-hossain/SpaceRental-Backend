import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  Matches,
  MaxLength,
  MinLength,
} from "class-validator";
import { UserRole } from "../../user/enum/user-role.enum";

export class SignUpDto {
  @IsNotEmpty({ message: "Email should not be empty" })
  @IsEmail({}, { message: "Invalid email format" })
  readonly email: string;

  @IsNotEmpty({ message: "Password should not be empty" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @MaxLength(20, { message: "Password cannot be longer than 20 characters" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]*$/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  })
  readonly password: string;

  @IsEnum(UserRole, { message: "Invalid role" })
  readonly role: UserRole;

  @IsOptional()
  @IsNotEmpty({ message: "Full name should not be empty" })
  readonly fullName?: string;

  @IsOptional()
  @IsNotEmpty({ message: "Phone number should not be empty" })
  @IsPhoneNumber(undefined, { message: "Invalid phone number format" })
  readonly phoneNumber?: string;

  @IsOptional()
  readonly countryCode?: string;

  @IsOptional()
  @IsDateString()
  readonly dateOfBirth?: Date;
}
