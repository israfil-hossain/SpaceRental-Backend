import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Injectable()
export class EncryptionService {
  private readonly _saltRounds: number = 10;
  private readonly _logger: Logger = new Logger(EncryptionService.name);

  async hashPassword(rawPassword: string): Promise<string> {
    if (!rawPassword) {
      this._logger.error("Password is required");
      throw new BadRequestException("Password is required");
    }

    return await bcrypt.hash(rawPassword, this._saltRounds);
  }

  async verifyPassword(
    rawPassword: string = "",
    hashedPassword: string = "",
  ): Promise<boolean> {
    if (!rawPassword) {
      this._logger.error("Password is required");
      throw new BadRequestException("Password is required");
    }

    return await bcrypt.compare(rawPassword, hashedPassword);
  }
}
