import { Transform } from "class-transformer";
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { UserRole } from "../enum/user-role.enum";

export class UserCreateDto {
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @IsNotEmpty({ message: "Password is required" })
  @IsString({ message: "Password must be a string" })
  password: string;

  @IsEnum(UserRole, { message: "Invalid user role" })
  role: UserRole;

  @IsOptional()
  @IsString({ message: "Full name must be a string" })
  fullName?: string;

  @IsOptional()
  @IsString({ message: "Phone number must be a string" })
  phoneNumber?: string;

  @IsOptional()
  @IsString({ message: "Country code must be a string" })
  countryCode?: string;

  @IsOptional()
  @Transform(({ value }) => value && new Date(value))
  @IsDate({
    message: "Invalid date of birth format, please provide a valid date",
  })
  dateOfBirth?: Date;
}
