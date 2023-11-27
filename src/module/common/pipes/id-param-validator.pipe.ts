import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { Types } from "mongoose";

@Injectable()
export class IdParamValidator implements PipeTransform {
  constructor() {}

  transform(value: string, metadata: ArgumentMetadata): string {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(`${metadata?.data}: Invalid document ID`);
    }

    return value;
  }
}
