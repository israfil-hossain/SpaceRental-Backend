import { OmitType } from "@nestjs/swagger";
import { SignInDto } from "./sign-in.dto";

export class AdminSignInDto extends OmitType(SignInDto, ["role"]) {}
