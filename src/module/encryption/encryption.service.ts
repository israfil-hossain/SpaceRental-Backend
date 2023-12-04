import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Injectable()
export class EncryptionService {
  private readonly saltRounds: number = 10;
  private readonly logger: Logger = new Logger(EncryptionService.name);

  async hashPassword(rawPassword: string): Promise<string> {
    if (!rawPassword) {
      throw new BadRequestException("Password is required");
    }

    return await bcrypt.hash(rawPassword, this.saltRounds);
  }

  async verifyPassword(
    rawPassword: string = "",
    hashedPassword: string = "",
  ): Promise<boolean> {
    if (!rawPassword) {
      throw new BadRequestException("Password is required");
    }

    return await bcrypt.compare(rawPassword, hashedPassword);
  }
}
