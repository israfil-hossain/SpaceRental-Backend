import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import toStream from "buffer-to-stream";
import {
  v2 as CloudinaryAPI,
  DeleteApiResponse,
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary";
import {
  ImageDocument,
  ImageModel,
  ImageModelType,
} from "./entities/image.entity";

@Injectable()
export class ImageService {
  private readonly _logger: Logger = new Logger(ImageService.name);

  constructor(
    @InjectModel(ImageModel.name) private readonly imageModel: ImageModelType,
  ) {}

  async createSingleImage(
    singleImageFile: Express.Multer.File,
    createdBy: string,
  ): Promise<ImageDocument> {
    const extension = this._getFileExtension(singleImageFile.originalname);
    const uploadResult = await this._uploadImageToCloudinary(singleImageFile);

    const singleImage = new this.imageModel({
      url: uploadResult.secure_url,
      name: uploadResult.public_id,
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
  ): Promise<ImageDocument[]> {
    const multipleImages = await Promise.all(
      multipleImageFiles.map(
        async (image) => await this.createSingleImage(image, createdBy),
      ),
    );

    return multipleImages;
  }

  async removeImage(imageId: string): Promise<boolean> {
    try {
      const image = await this.imageModel.findById(imageId);

      if (!image) {
        throw new Error(`Could not find image with id: ${imageId}`);
      }

      await this._deleteImageFromCloudinary(image.name);
      await image.deleteOne();

      return true;
    } catch (error) {
      this._logger.error(`Failed to delete image: ${error}`);
      return false;
    }
  }

  private async _uploadImageToCloudinary(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse> {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const upload = CloudinaryAPI.uploader.upload_stream(
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) {
            this._logger.error(
              `Failed to upload image to Cloudinary: ${error.message}`,
            );
            reject(error);
          } else if (!result) {
            const errorMessage = "Upload result is undefined";
            this._logger.error(
              `Failed to upload image to Cloudinary: ${errorMessage}`,
            );
            reject(new Error(errorMessage));
          } else {
            resolve(result);
          }
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }

  private async _deleteImageFromCloudinary(
    publicId: string,
  ): Promise<DeleteApiResponse> {
    return CloudinaryAPI.uploader.destroy(publicId);
  }

  private _getFileExtension(originalName: string): string {
    const lastDotIndex = originalName?.lastIndexOf(".");

    if (lastDotIndex === -1) {
      return "";
    }

    return originalName?.slice(lastDotIndex + 1);
  }
}
