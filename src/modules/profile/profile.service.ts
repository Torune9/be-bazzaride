import {
  BadRequestException,
  ConflictException,
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
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('User id tidak ditemukan');
        }

        if (error.code === 'P2002') {
          throw new ConflictException('Profile sudah ada');
        }
      }

      throw new BadRequestException();
    }
  }

  async findAll() {
    try {
      const profile = await this.prismaService.profile.findMany({
        include: {
          user: true,
        },
      });

      return profile;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async findOne(id: string) {
    const profile = await this.prismaService.profile.findUnique({
      where: { id },
    });

    if (!profile) {
      throw new NotFoundException('Profile tidak ditemukan');
    }

    return profile;
  }

  async update(
    id: string,
    updateProfileDto: UpdateProfileDto,
    file?: Express.Multer.File,
  ) {
    const existing = await this.prismaService.profile.findUnique({
      where: { id },
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
        throw new InternalServerErrorException('Gagal upload profile');
      }
    }

    const updated = await this.prismaService.profile.update({
      where: { id },
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
