import { IsEmail, IsNotEmpty } from "class-validator";

export class SignInDto {
  @IsNotEmpty({ message: "Email should not be empty" })
  @IsEmail({}, { message: "Invalid email format" })
  readonly email: string;

  @IsNotEmpty({ message: "Password should not be empty" })
  readonly password: string;
}
