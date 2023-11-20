import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');

@Injectable()
export class CloudinaryService {
  async uploadImage(file): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });

      toStream(file.buffer).pipe(upload);
    });
  }

  async removeImage(imageId: string) {
    await v2.uploader
      .destroy(imageId, function (error, result) {})
      .then((resp) => console.log(resp))
      .catch((_err) =>
        console.log(
          'Something went wrong on destroying the image, please try again later.',
        ),
      );
  }
}
