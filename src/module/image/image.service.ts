import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import toStream from "buffer-to-stream";
import {
  v2 as CloudinaryAPI,
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary";
import { ImageModel, ImageModelType } from "./entities/image.entity";

@Injectable()
export class ImageService {
  private readonly _logger: Logger = new Logger(ImageService.name);

  constructor(
    @InjectModel(ImageModel.name) private readonly imageModel: ImageModelType,
  ) {}

  async createSingleImage(
    singleImageFile: Express.Multer.File,
    createdBy: string,
  ) {
    const { name, extension } = this._separateFileNameAndExtension(
      singleImageFile.originalname,
    );
    const url = await this._generateImageUrl(singleImageFile);

    const singleImage = new this.imageModel({
      url: url,
      name: name,
      extension: extension,
      size: singleImageFile.size,
      mimeType: singleImageFile.mimetype,
      createdBy,
    });

    await singleImage.save();
    return singleImage;
  }

  async createMultipleImages(
    multipleImageFiles: Express.Multer.File[],
    createdBy: string,
  ) {
    const multipleImages = await Promise.all(
      multipleImageFiles.map(
        async (image) => await this.createSingleImage(image, createdBy),
      ),
    );

    return multipleImages;
  }

  private async _generateImageUrl(file: Express.Multer.File): Promise<string> {
    const result = await this._uploadImage(file);

    if (result && result.secure_url) {
      return result.secure_url;
    } else {
      this._logger.error("Failed to upload image to Cloudinary");
      throw new Error("Failed to upload image to Cloudinary");
    }
  }

  private async _uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse> {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const upload = CloudinaryAPI.uploader.upload_stream(
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) return reject(error);
          if (!result) {
            return reject(new Error("Upload result is undefined"));
          }
          resolve(result);
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }

  private _separateFileNameAndExtension(originalName: string): {
    name: string;
    extension: string;
  } {
    const lastDotIndex = originalName?.lastIndexOf(".");

    if (lastDotIndex === -1) {
      return { name: originalName, extension: "" };
    }

    const name = originalName?.slice(0, lastDotIndex);
    const extension = originalName?.slice(lastDotIndex + 1);

    return { name, extension };
  }
}
