import { IsEmail, IsNotEmpty, Matches, MinLength } from "class-validator";
import { CreateUserDto } from "../../user/dto/create-user.dto";

export class SignUpDto extends CreateUserDto {
  @IsNotEmpty({ message: "Email should not be empty" })
  @IsEmail({}, { message: "Invalid email format" })
  readonly email: string;

  @IsNotEmpty({ message: "Password should not be empty" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]*$/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  })
  readonly password: string;
}
