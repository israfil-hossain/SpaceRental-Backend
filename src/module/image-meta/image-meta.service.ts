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
  ImageMeta,
  ImageMetaDocument,
  ImageMetaType,
} from "./entities/image-meta.entity";

@Injectable()
export class ImageMetaService {
  private readonly _logger: Logger = new Logger(ImageMetaService.name);

  constructor(
    @InjectModel(ImageMeta.name) private readonly _imageMeta: ImageMetaType,
  ) {}

  async createSingleImage(
    singleImageFile: Express.Multer.File,
    ownerId: string,
  ): Promise<ImageMetaDocument> {
    if (!singleImageFile) {
      throw new Error("No image file provided");
    }

    const extension = this._getFileExtension(singleImageFile.originalname);
    const uploadResult = await this._uploadImageToCloudinary(singleImageFile);

    const singleImage = new this._imageMeta({
      url: uploadResult.secure_url,
      name: uploadResult.public_id,
      extension: extension,
      size: singleImageFile.size,
      mimeType: singleImageFile.mimetype,
      ownerId: ownerId,
    });

    await singleImage.save();
    return singleImage;
  }

  async createMultipleImages(
    multipleImageFiles: Express.Multer.File[],
    ownerId: string,
  ): Promise<ImageMetaDocument[]> {
    if (!multipleImageFiles.length) {
      throw new Error("No image files provided");
    }

    const multipleImages = await Promise.all(
      multipleImageFiles.map(
        async (image) => await this.createSingleImage(image, ownerId),
      ),
    );

    return multipleImages;
  }

  async removeImage(
    imageId: string,
    ownerId: string,
  ): Promise<ImageMetaDocument | null> {
    const deletedImage = await this._imageMeta
      .findOneAndDelete({
        _id: imageId,
        ownerId: ownerId,
      })
      .exec();

    if (!deletedImage) {
      throw new Error(`Could not find image with id: ${imageId}`);
    }

    await this._deleteImageFromCloudinary(deletedImage.name);
    await this._imageMeta.findByIdAndDelete(imageId).exec();

    return deletedImage;
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
