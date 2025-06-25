/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  UseInterceptors,
  applyDecorators,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'path';

const storageImage = multer.memoryStorage();
const MAX_SIZE = 5 * 1024 * 1024;
export const imageUploadInterceptor = (fieldName: string) => {
  const fileFilter = (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );

    if (mimeType && extname) return cb(null, true);

    return cb(
      new BadRequestException('Only .jpg, .jpeg, .png files are allowed'),
      false,
    );
  };

  const multerOptions = {
    storage: storageImage,
    limits: { fileSize: MAX_SIZE },
    fileFilter,
  };

  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldName, multerOptions)),
  );
};
