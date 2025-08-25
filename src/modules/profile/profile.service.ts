import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CloudinaryService } from 'src/libs/cloudinary/cloudinary.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { getPublicIdFromUrl } from 'src/helper/get-public-id';

@Injectable()
export class ProfileService {
  constructor(
    private prismaService: PrismaService,
    private cloudinary: CloudinaryService,
  ) {}
  async create(createProfileDto: CreateProfileDto, file: Express.Multer.File) {
    try {
      const { userId, firstName, lastName, description } = createProfileDto;

      let imageUrl: string | undefined;

      if (file) {
        imageUrl = await this.cloudinary.uploadImage(file);
      }

      const profile = await this.prismaService.profile.create({
        data: {
          firstName,
          lastName,
          description,
          image: imageUrl,
          user: {
            connect: { id: userId },
          },
        },
      });

      return profile;
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  }

  async getProfile(userId: string) {
    const profile = await this.prismaService.profile.findFirst({
      where: { userId },
      include: { user: { include: { store: true } } },
    });

    if (!profile) {
      throw new NotFoundException('Profile tidak ditemukan');
    }

    return profile;
  }

  async findOne(id: string) {
    const profile = await this.prismaService.profile.findUnique({
      where: {
        userId: id,
      },
      include: {
        user: {
          include: {
            store: true,
          },
        },
      },
    });

    if (!profile) {
      throw new NotFoundException('Profile tidak ditemukan');
    }

    return profile;
  }

  async update(
    userId: string,
    updateProfileDto: UpdateProfileDto,
    file?: Express.Multer.File,
  ) {
    const existing = await this.prismaService.profile.findUnique({
      where: { userId },
    });

    if (!existing) {
      throw new NotFoundException('Profile tidak ditemukan');
    }

    if (file) {
      const newPosterUrl = await this.cloudinary.uploadImage(file);
      updateProfileDto.image = newPosterUrl;
    }

    if (existing.image) {
      try {
        const publicId = getPublicIdFromUrl(existing.image);
        await this.cloudinary.deleteImage(publicId);
      } catch (error) {
        throw new InternalServerErrorException('Gagal image hapus profile');
      }
    }

    const updated = await this.prismaService.profile.update({
      where: { userId },
      data: updateProfileDto,
    });

    return updated;
  }

  async remove(id: string) {
    try {
      const profile = await this.prismaService.profile.delete({
        where: { id },
      });

      return profile;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('Profile tidak ditemukan');
      }

      throw new InternalServerErrorException('Gagal menghapus profile');
    }
  }
}
