/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CloudinaryService } from 'src/libs/cloudinary/cloudinary.service';
import { getPublicIdFromUrl } from 'src/helper/get-public-id';

@Injectable()
export class StoreService {
  constructor(
    private prismaService: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}
  async create(createStoreDto: CreateStoreDto, file: Express.Multer.File) {
    let imageUrl: string | undefined;

    if (file) {
      imageUrl = await this.cloudinary.uploadImage(file);
    }

    const store = await this.prismaService.store.create({
      data: {
        name: createStoreDto.name,
        description: createStoreDto.description,
        image: imageUrl,
        user: {
          connect: { id: createStoreDto.userId },
        },
      },
    });

    return store;
  }

  async findAll() {
    const stores = await this.prismaService.store.findMany({
      include: {
        user: true,
      },
    });

    return stores;
  }

  async findOne(id: string) {
    const store = await this.prismaService.store.findUnique({
      where: {
        id,
      },
    });

    if (!store) {
      throw new NotFoundException('Store not found');
    }

    return store;
  }

  async update(
    id: string,
    updateStoreDto: UpdateStoreDto,
    file?: Express.Multer.File,
  ) {
    const existingStore = await this.prismaService.store.findUnique({
      where: { id },
    });

    if (!existingStore) {
      throw new NotFoundException('Store tidak ditemukan');
    }

    if (file) {
      const imageUpdateUrl = await this.cloudinary.uploadImage(file);
      updateStoreDto.image = imageUpdateUrl;
    }

    if (existingStore.image) {
      try {
        const publicId = getPublicIdFromUrl(existingStore.image);
        await this.cloudinary.deleteImage(publicId);
      } catch (error) {
        throw new InternalServerErrorException('Gagal hapus image store');
      }
    }
    const updateStore = await this.prismaService.store.update({
      where: { id },
      data: updateStoreDto,
    });

    return updateStore;
  }

  async remove(id: string) {
    const store = await this.prismaService.store.delete({
      where: {
        id,
      },
    });

    if (!store) {
      throw new NotFoundException('Store tidak ditemukan');
    }
    return store;
  }
}
